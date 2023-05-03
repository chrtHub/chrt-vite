import { IModelFriendly, ModelAPINames } from "./chatson_types";

export default function getFriendly(
  model_api_name: ModelAPINames,
  model_friendly_names: Partial<Record<ModelAPINames, Object>>, //-- CC.model_friendly_names --//
  option: keyof IModelFriendly
) {
  let modelFriendly: IModelFriendly | undefined;
  if (model_api_name && model_friendly_names[model_api_name]) {
    modelFriendly = model_friendly_names[model_api_name] as IModelFriendly;
  }
  if (modelFriendly) {
    return modelFriendly[option];
  }
  return "";
}
