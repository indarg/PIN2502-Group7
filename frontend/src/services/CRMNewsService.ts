import { TNews } from "src/models/TNews";
import HttpService from "./HttpService";

export default class CRMNewsService extends HttpService<TNews> {
  constructor() {
    super('v1/motor-insight/crm/news/');
  }
}