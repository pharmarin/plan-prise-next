import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import {
  DocWithData,
  PrimaryData,
  RelationshipsObject,
  RelationshipsWithData,
  ResourceIdentifierObject,
  ResourceObject,
} from "jsonapi-typescript";
import { ResourcesState } from "lib/types";
import { castArray, isPlainObject, setWith, unset } from "lodash";

const initialState: ResourcesState = {};

const syncResources = (
  resources: ResourceObject[],
  state: Draft<ResourcesState>
) => {
  resources.forEach((resource) => {
    if (!(resource.type in state)) {
      state[resource.type] = {};
    }

    if (!resource.id) {
      return;
    }

    state[resource.type][resource.id] = {
      ...resource,
      meta: { fetched: resource } as any,
    };
  });
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState: initialState,
  reducers: {
    addResourceRelationship: (
      state,
      {
        payload,
      }: PayloadAction<{
        resource: ResourceIdentifierObject;
        key: string;
        value: ResourceIdentifierObject;
      }>
    ) => {
      const { key, resource, value } = payload;
      console.log("payload: ", payload);

      if (
        state &&
        "relationships" in state[resource.type][resource.id] &&
        state[resource.type][resource.id].relationships &&
        key in
          (state[resource.type][resource.id]
            .relationships as RelationshipsObject) &&
        "data" in
          (
            state[resource.type][resource.id]
              .relationships as RelationshipsObject
          )[key]
      ) {
        (
          (
            (
              state[resource.type][resource.id]
                .relationships as RelationshipsObject
            )[key] as RelationshipsWithData
          ).data as ResourceIdentifierObject[]
        ).push(value);
      }
    },
    commitResource: (state, { payload }: PayloadAction<ResourceObject>) => {
      setWith(
        state,
        `${payload.type}.${payload.id}.meta.fetched`,
        payload,
        Object
      );
    },
    removeResource: (
      state,
      { payload }: PayloadAction<ResourceIdentifierObject>
    ) => {
      unset(state, [payload.type, payload.id]);
    },
    removeResourceAttribute: (
      state,
      {
        payload,
      }: PayloadAction<{
        resource: ResourceIdentifierObject;
        path: string[];
      }>
    ) => {
      unset(state, [
        payload.resource.type,
        payload.resource.id,
        "attributes",
        ...payload.path,
      ]);
    },
    removeResourceRelationship: (
      state,
      {
        payload,
      }: PayloadAction<{
        resource: ResourceIdentifierObject;
        key: string;
        value: ResourceIdentifierObject;
      }>
    ) => {
      const { key, resource, value } = payload;

      if (
        state &&
        "relationships" in state[resource.type][resource.id] &&
        state[resource.type][resource.id].relationships &&
        key in
          (state[resource.type][resource.id]
            .relationships as RelationshipsObject) &&
        "data" in
          (
            state[resource.type][resource.id]
              .relationships as RelationshipsObject
          )[key]
      ) {
        ((
          (
            state[resource.type][resource.id]
              .relationships as RelationshipsObject
          )[key] as RelationshipsWithData
        ).data as ResourceIdentifierObject[]) = (
          (
            (
              state[resource.type][resource.id]
                .relationships as RelationshipsObject
            )[key] as RelationshipsWithData
          ).data as ResourceIdentifierObject[]
        ).filter((item) => !(item.type === value.type && item.id === value.id));
      }
    },
    setResourceAttribute: (
      state,
      {
        payload,
      }: PayloadAction<{
        resource: ResourceIdentifierObject;
        path: string[];
        value: any;
      }>
    ) => {
      // Make sure that the value we try to change is not an array or else (leads to unhandled error)
      if (
        payload.path[0] &&
        payload.path[1] &&
        !isPlainObject(
          (
            state[payload.resource.type][payload.resource.id].attributes?.[
              payload.path[0]
            ] as any
          )?.[payload.path[1]]
        )
      ) {
        setWith(
          state,
          [
            payload.resource.type,
            payload.resource.id,
            "attributes",
            payload.path[0],
            payload.path[1],
          ],
          {},
          Object
        );
      }

      return setWith(
        state,
        [
          payload.resource.type,
          payload.resource.id,
          "attributes",
          ...payload.path,
        ],
        payload.value,
        Object
      );
    },
    sync: (state, { payload }: PayloadAction<DocWithData | PrimaryData>) => {
      if ("data" in payload) {
        syncResources(
          [
            ...castArray(payload.data),
            ...Object.values(payload.included || {}).flat(),
          ],
          state
        );
      } else {
        syncResources(castArray(payload), state);
      }
    },
    updateResourceRelationship: (
      state,
      {
        payload,
      }: PayloadAction<{
        resource: ResourceIdentifierObject;
        key: string;
        newValue: ResourceIdentifierObject;
        oldValue: ResourceIdentifierObject;
      }>
    ) => {
      const { key, resource, newValue, oldValue } = payload;

      if (
        state &&
        "relationships" in state[resource.type][resource.id] &&
        state[resource.type][resource.id].relationships &&
        key in
          (state[resource.type][resource.id]
            .relationships as RelationshipsObject) &&
        "data" in
          (
            state[resource.type][resource.id]
              .relationships as RelationshipsObject
          )[key]
      ) {
        ((
          (
            state[resource.type][resource.id]
              .relationships as RelationshipsObject
          )[key] as RelationshipsWithData
        ).data as ResourceIdentifierObject[]) = (
          (
            (
              state[resource.type][resource.id]
                .relationships as RelationshipsObject
            )[key] as RelationshipsWithData
          ).data as ResourceIdentifierObject[]
        ).map((relation) =>
          relation.type === oldValue.type && relation.id === oldValue.id
            ? newValue
            : relation
        );
      }
    },
  },
  extraReducers: (builder) => {
    /* builder.addCase(loadSingleResource.fulfilled, (state, { payload }) => {
      syncResources(forceArray(payload.data), state);
    }); */
  },
});

export const {
  addResourceRelationship,
  commitResource,
  removeResource,
  removeResourceAttribute,
  removeResourceRelationship,
  setResourceAttribute,
  sync,
  updateResourceRelationship,
} = resourcesSlice.actions;
export default resourcesSlice.reducer;
