import { AxiosError } from "axios";
import {
  AttributesObject,
  DocBase,
  Document,
  DocWithData,
  Errors,
  RelationshipsObject,
  RelationshipsWithData,
  ResourceIdentifierObject,
  ResourceObject,
} from "jsonapi-typescript";
import axios from "lib/axios";
import { sync } from "lib/redux/resources/slice";
import store, { ReduxState } from "lib/redux/store";
import { castArray, isEqual, pickBy, transform, uniqueId } from "lodash";
import "reflect-metadata";

export type QueryOptions = {
  include?: string | string[];
  filter?: Record<string, string | string[]>;
  sort?: string | string[];
  fields?: Record<string, string | string[]>;
  custom?: ({ key: string; value: string } | string)[];
};

export type RequestOptions = {
  query?: QueryOptions;
  noSync?: boolean;
};

export const handleResponse = (
  response: Document,
  options?: RequestOptions
) => {
  const dispatch = store.dispatch;

  if (response && "errors" in response) {
    throw new Error("Le serveur a renvoyé un erreur");
  }

  if (!options?.noSync) {
    dispatch(
      sync([
        ...(response &&
        "included" in response &&
        Array.isArray(response.included)
          ? response.included
          : []),
        ...(response && "data" in response ? castArray(response.data) : []),
      ])
    );
  }

  if ((response && "data" in response) || !response) {
    return response;
  }

  throw new Error("Le serveur a renvoyé une réponse invalide");
};

const ATTRIBUTES_METADATA_KEY = "registeredAttributes";

export const Attribute =
  (options?: { getter?: (value: any) => any; setter?: (value: any) => any }) =>
  <M extends BaseModel>(target: M, propertyKey: string) => {
    let attributeValue: any;

    let registeredAttributes: string[] = Reflect.getMetadata(
      ATTRIBUTES_METADATA_KEY,
      target
    );

    if (registeredAttributes) {
      registeredAttributes.push(propertyKey);
    } else {
      registeredAttributes = [propertyKey];
      Reflect.defineMetadata(
        ATTRIBUTES_METADATA_KEY,
        registeredAttributes,
        target
      );
    }

    Object.defineProperty(target, propertyKey, {
      get: () =>
        options?.getter ? options.getter(attributeValue) : attributeValue,
      set: (value) =>
        (attributeValue = options?.setter ? options.setter(value) : value),
    });
  };

export type AttributesKeysOnly<
  M extends BaseModel,
  A extends AttributesObject
> = {
  [K in keyof M]: K extends keyof A
    ? A[K]
    : K extends keyof BaseModel
    ? BaseModel[K]
    : never;
};

class BaseModel<A extends AttributesObject = AttributesObject> {
  static readonly type: string;
  static readonly defaultIncludes: string[];
  static readonly defaultRelationships: { [key: string]: any } = {};

  public id: string;
  public type: string;
  public identifier: ResourceIdentifierObject;

  public instance = this.constructor;

  protected attributes: A = {} as A;
  private relationships?: RelationshipsObject;

  constructor(data?: ResourceObject<string, A> | ResourceIdentifierObject) {
    this.id = data?.id ?? uniqueId("-");

    this.type =
      data?.type ??
      (this.constructor as typeof BaseModel).type ??
      uniqueId("model_type_");

    this.identifier = {
      id: this.id,
      type: this.type,
    };

    this.attributes =
      data && "attributes" in data && data.attributes
        ? data.attributes
        : ({} as A);
    this.assignAttributes(this.attributes || {});

    this.relationships =
      data && "relationships" in data
        ? data.relationships
        : transform(
            (this.constructor as typeof BaseModel).defaultRelationships,
            (result, value, key) => {
              result[key] = { data: value };
            },
            {} as RelationshipsObject
          );
  }

  get registeredAttributes(): (keyof A)[] {
    return Reflect.getMetadata(ATTRIBUTES_METADATA_KEY, this);
  }

  public assignAttributes = (attributes: Partial<A>) => {
    Object.assign(
      this,
      pickBy(attributes, (_, key) => this.registeredAttributes.includes(key))
    );
  };

  protected getResources = () => {
    return (store.getState() as ReduxState).resources;
  };

  protected getRelationship = <M extends typeof BaseModel>(
    key: string,
    Model: M | { [key: string]: M }
  ): any => {
    if (
      !this.relationships ||
      !(key in this.relationships) ||
      !("data" in this.relationships[key])
    ) {
      return undefined;
    }

    const findIncluded = (identifier: ResourceIdentifierObject) => {
      return this.getResources()?.[identifier.type]?.[identifier.id];
    };

    const getModel = (identifier: ResourceIdentifierObject) => {
      if (typeof Model === "object") {
        return Object.values(Model).find(
          (model) => model.type === identifier.type
        );
      } else {
        return Model.type === identifier.type ? Model : undefined;
      }
    };

    const getRelation = (identifier: ResourceIdentifierObject, Model?: M) => {
      const relation = findIncluded(identifier);

      if (relation && Model) {
        return new Model(relation);
      } else {
        return new BaseModel(identifier);
      }
    };

    const relationship = (this.relationships[key] as RelationshipsWithData)
      .data as ResourceIdentifierObject | ResourceIdentifierObject[];

    if (Array.isArray(relationship)) {
      return relationship.map((identifier: ResourceIdentifierObject) =>
        getRelation(identifier, getModel(identifier))
      );
    } else {
      return getRelation(relationship, getModel(relationship));
    }
  };

  serializeWithValue(
    attributes: AttributesObject,
    relationships?: RelationshipsObject | undefined
  ) {
    return {
      ...this.identifier,
      attributes: attributes,
      relationships: relationships,
    };
  }

  serialize = (full = false): ResourceObject => {
    let modifiedAttributes: { [key: string]: any } = {};
    const filter = !full && !this.id.startsWith("-") && this.id !== "nouveau";

    if (filter) {
      const original =
        (this.getResources()[this.type][this.id].meta
          ?.fetched as unknown as ResourceObject) || {};

      Object.keys(this.attributes || {}).forEach((key) => {
        if (!isEqual(this.attributes?.[key], original.attributes?.[key])) {
          modifiedAttributes[key] = this.attributes?.[key];
        }
      });
    }

    return this.serializeWithValue(
      !filter ? this.attributes || {} : modifiedAttributes,
      this.relationships
    );
  };

  /* update = (values: AttributesObject) => {
    if (!this.attributes) {
      this.attributes = {};
    }

    console.log("this.attributes: ", this.attributes);

    Object.entries(values).forEach(
      ([attributeKey, attributeValue]) =>
        ((this.attributes || {})[attributeKey] = attributeValue)
    );

    return this;
  }; */

  get documentWithData(): DocWithData {
    return {
      data: {
        ...this.identifier,
        attributes: Object.fromEntries(
          this.registeredAttributes.map((attributeKey) => [
            attributeKey,
            (this as any)[attributeKey],
          ])
        ),
      },
    };
  }

  /**
   * FETCHER
   */

  static prepareInclude(include: QueryOptions["include"]) {
    return include ? [`include=${include}`] : [];
  }

  static prepareFilter(filter: QueryOptions["filter"]) {
    return Object.entries(filter || {})
      .map(([key, value]) =>
        Array.isArray(value) ? { key, value: value.join(",") } : { key, value }
      )
      .map((filter) => `filter[${filter.key}]=${filter.value}`);
  }

  static prepareSort(sort: QueryOptions["sort"]) {
    return sort ? [`sort=${sort}`] : [];
  }

  static prepareFields(fields: QueryOptions["fields"]) {
    return Object.entries(fields || {}).map(
      ([key, value]) => `fields[${key}]=${value}`
    );
  }

  static prepareCustom(custom: QueryOptions["custom"]) {
    return (custom || []).map((custom) =>
      typeof custom === "string" ? custom : `${custom.key}=${custom.value}`
    );
  }

  static buildUrl(
    this: typeof BaseModel,
    path: string,
    options?: QueryOptions
  ) {
    const params: string[] = ([] as string[]).concat(
      this.prepareInclude(options && options.include),
      this.prepareFilter(options && options.filter),
      this.prepareSort(options && options.sort),
      this.prepareFields(options && options.fields),
      this.prepareCustom(options && options.custom)
    );

    return `${process.env.NEXT_PUBLIC_API_PATH || ""}/${path}${
      params.length > 0 ? `?${params.join("&")}` : ""
    }`;
  }

  get pathWithID(): string {
    return `${this.type}/${this.id}`;
  }

  static async fetch<T extends typeof BaseModel>(
    this: T,
    identifier: { id?: string },
    options?: RequestOptions
  ) {
    const modelUrl = `${this.type}${identifier.id ? "/" + identifier.id : ""}`;

    const url = this.buildUrl(modelUrl, options?.query);

    const response = await axios.get<Document>(url).then((response) =>
      handleResponse(response.data, {
        query: options?.query,
        noSync: options?.noSync ?? options?.query?.fields !== undefined,
      })
    );

    return response;
  }

  static async getOne<T extends typeof BaseModel>(
    this: T,
    id: string,
    options?: RequestOptions
  ) {
    const response = await this.fetch({ id }, options);

    if (!Array.isArray(response.data)) {
      return {
        data: this.extractOne(response.data),
        meta: response.meta,
      };
    }

    throw new Error("Le serveur a renvoyé une réponse invalide");
  }

  static async getMany<T extends typeof BaseModel>(
    this: T,
    options?: RequestOptions
  ) {
    const response = await this.fetch({}, options);

    if (Array.isArray(response.data)) {
      return {
        data: this.extractMany(response.data),
        meta: response.meta,
      };
    }

    throw new Error("Le serveur a renvoyé une réponse invalide");
  }

  /**
   * SETTER
   */

  save() {
    if (false && this.id.startsWith("-")) {
      //return this.postWithValues(values);
    } else {
      return this.patch();
    }
  }

  async patch(values?: ResourceObject, customUrl?: string) {
    const url = BaseModel.buildUrl(this.pathWithID);

    console.log(this.documentWithData);

    return await axios
      .patch<Document>(
        customUrl ?? url,
        values ? ({ data: values } as DocWithData) : this.documentWithData
      )
      .then((response) => response.data);
  }

  async postWithValues(values: ResourceObject) {
    delete values.id;

    const data: DocWithData = {
      data: values,
    };

    return await axios
      .post<Document>(this.type, data)
      .then((response) => response.data);
  }

  async saveWithValues(values: ResourceObject) {
    if (this.id.startsWith("-")) {
      return this.postWithValues(values);
    } else {
      return this.patch(values);
    }
  }

  async delete(data?: DocBase) {
    const url = BaseModel.buildUrl(this.pathWithID);

    return await axios
      .delete<Document>(url, { data })
      .then((response) => response.data)
      .catch((error: AxiosError<Errors>) => error.response?.data);
  }

  /**
   * EXTRACTER
   */

  static extractOne<
    Attributes extends AttributesObject,
    Data extends ResourceObject<string, Attributes> | ResourceIdentifierObject,
    ModelType extends typeof BaseModel,
    ModelInstance extends { new (data: Data): InstanceType<ModelType> }
  >(this: ModelType, data?: Data) {
    if (!data) {
      return undefined;
    }

    if (Array.isArray(data)) {
      throw new Error("Le serveur a répondu un nombre de données invalide");
    }

    return new this(data) as unknown as ModelInstance;
  }

  static extractMany<T extends typeof BaseModel>(
    this: T,
    data?: (ResourceObject | ResourceIdentifierObject)[],
    modelMapper?: { [type: string]: T }
  ) {
    if (!data) {
      return undefined;
    }

    if (!Array.isArray(data)) {
      throw new Error("Le serveur a répondu un nombre de données invalide");
    }

    return data.map((item) => {
      const CurrentModel: T | undefined =
        item.type === this.type ? this : modelMapper?.[item.type];

      if (!CurrentModel || item.type !== CurrentModel.type) {
        throw new Error("Le serveur a répondu un type de données invalide");
      }

      return new CurrentModel(item) as InstanceType<T>;
    });
  }
}

export default BaseModel;
