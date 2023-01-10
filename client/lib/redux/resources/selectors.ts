import BaseModel from "lib/redux/models/BaseModel";
import { ReduxState } from "lib/redux/store";
import createCachedSelector from "re-reselect";

const selectResources = (state: ReduxState) => state.resources;

export const selectResource = <M extends typeof BaseModel>(Model: M) =>
  createCachedSelector(
    selectResources,
    (state: ReduxState, id: string) => id,
    (resources, id) => {
      const resource = resources?.[Model.type]?.[id];

      return resource
        ? (new Model(resources?.[Model.type]?.[id]) as InstanceType<M>)
        : undefined;
    }
  )((state, id) => `${Model.type}-${id}`);

export const selectExistingResource = createCachedSelector(
  (state: ReduxState, Model: typeof BaseModel, id: string) =>
    selectResource(Model)(state, id),
  (resource) => resource !== undefined
)((state, Model, id) => `${Model.type}-${id}`);
