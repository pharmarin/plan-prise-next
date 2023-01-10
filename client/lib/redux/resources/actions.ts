import {
  AnyAction,
  createAsyncThunk,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import {
  Document,
  DocWithData,
  ResourceIdentifierObject,
  ResourceObject,
} from "jsonapi-typescript";
import axios from "lib/axios";
import BaseModel, {
  handleResponse,
  RequestOptions,
} from "lib/redux/models/BaseModel";
import { selectResource } from "lib/redux/resources/selectors";
import {
  commitResource,
  removeResource,
  sync,
} from "lib/redux/resources/slice";
import { ReduxState } from "lib/redux/store";
import { debounce } from "lodash";
import { dismissNotification, notify } from "reapop";

export const createResource = createAsyncThunk<
  ResourceIdentifierObject,
  { model: typeof BaseModel; data: DocWithData }
>("resource/create", async ({ model: Model, data }, { dispatch }) => {
  const response = await axios
    .post<Document>(
      Model.buildUrl(Model.type, { include: Model.defaultIncludes }),
      { data: { ...data.data, id: undefined } }
    )
    .then((response) => handleResponse(response.data));

  dispatch(removeResource({ type: Model.type, id: "nouveau" }));
  dispatch(sync(response.data));

  return {
    type: Model.type,
    id: (response.data as ResourceObject).id,
  } as ResourceIdentifierObject;
});

export const createResourceWithNotifications = createAsyncThunk(
  "resource/create/notify",
  async (
    identifier: {
      model: typeof BaseModel;
      data: DocWithData;
    },
    { dispatch }
  ) => {
    const { payload: notification } = dispatch(
      notify("Création en cours", "loading")
    );

    try {
      const response = await dispatch(createResource(identifier));

      dispatch(dismissNotification(notification.id));

      if (createResource.fulfilled.match(response)) {
        return response.payload;
      }
    } catch (error) {
      notification.status = "error";
      notification.message =
        "Une erreur est survenue lors de la création de l'élément";
      notification.buttons = [
        {
          name: "Réessayer",
          onClick: () => dispatch(createResource(identifier)),
        },
        {
          name: "Annuler",
          onClick: () => dispatch(dismissNotification(notification.id)),
        },
      ];

      dispatch(notify(notification));
    }
  }
);

export const deleteResource = createAsyncThunk(
  "resource/delete",
  async (identifier: ResourceIdentifierObject, { dispatch }) => {
    const modelUrl = `${identifier.type}/${identifier.id}`;

    const response = await axios.delete(modelUrl);

    dispatch(removeResource(identifier));

    return response;
  }
);

export const deleteResourceWithNotifications = createAsyncThunk(
  "resource/delete/notify",
  async (identifier: ResourceIdentifierObject, { dispatch }) => {
    const { payload: notification } = dispatch(
      notify("Suppression en cours", "loading")
    );

    try {
      await dispatch(deleteResource(identifier));

      notification.status = "success";
      notification.message = "L'élément a été supprimé";
      notification.dismissAfter = 1000;
      dispatch(notify(notification));
    } catch (error) {
      notification.status = "error";
      notification.message =
        "Une erreur est survenue lors de la suppression de l'élément";
      notification.buttons = [
        {
          name: "Réessayer",
          onClick: () => dispatch(deleteResource(identifier)),
        },
        {
          name: "Annuler",
          onClick: () => dispatch(dismissNotification(notification.id)),
        },
      ];

      dispatch(notify(notification));
    }
  }
);

export const fetchResource = createAsyncThunk<
  void,
  { model: typeof BaseModel; id: string; options?: RequestOptions }
>("resource/fetch", async ({ model: Model, id, options }, { dispatch }) => {
  const response = await Model.fetch({ id }, options);

  dispatch(sync(response));
});

export const saveResource = createAsyncThunk<
  DocWithData,
  { model: typeof BaseModel; id: string }
>("resource/save", async ({ model: Model, id }, { dispatch, getState }) => {
  const state = getState() as ReduxState;
  const resource = selectResource(Model)(state, id);

  if (!resource) {
    throw new Error("Impossible d'enregistrer une resource introuvable");
  }

  return resource
    .saveWithValues(resource.serialize())
    .then((response) => handleResponse(response))
    .then((response) => {
      dispatch(commitResource(resource.serialize(true)));
      return response;
    });
});

export const saveResourceWithNotifications = createAsyncThunk<
  PayloadAction<DocWithData> | void,
  { model: typeof BaseModel; id: string }
>("resource/save/notify", async ({ model: Model, id }, { dispatch }) => {
  const { payload: notification } = dispatch(
    notify("Sauvegarde en cours", "loading")
  );

  try {
    const response = await dispatch(saveResource({ model: Model, id }));
    dispatch(dismissNotification(notification.id));
    return response as PayloadAction<DocWithData>;
  } catch (error) {
    notification.status = "error";
    notification.message =
      "Une erreur est survenue lors de l'enregistrement du plan de prise";
    notification.buttons = [
      {
        name: "Réessayer",
        onClick: () =>
          dispatch(saveResourceWithNotifications({ model: Model, id })),
      },
      {
        name: "Annuler",
        onClick: () => dispatch(dismissNotification(notification.id)),
      },
    ];
    dispatch(notify(notification));
  }
});

const innerSaveResourceWithNotificationsDebounced = debounce(
  (dispatch, identifier) => dispatch(saveResourceWithNotifications(identifier)),
  2000
);

export const saveResourceWithNotificationsDebounced =
  (identifier: { model: typeof BaseModel; id: string }) =>
  (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) =>
    innerSaveResourceWithNotificationsDebounced(dispatch, identifier);
