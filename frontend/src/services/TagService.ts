import { TTag } from "src/models/TTag";
import HttpService from "./HttpService";

export default class TagService extends HttpService<TTag> {


  constructor() {
    super('v1/motor-insight/tags/');
  }

}