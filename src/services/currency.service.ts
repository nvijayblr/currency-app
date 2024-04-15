/* eslint-disable array-callback-return */
import axios from "axios";
import commonUtils from "../utils/CommonUtils";

class CurrencyService {
  private baseUrl = process.env.REACT_APP_BASEURL;
  private apiVersion = process.env.REACT_APP_API_VERSION;

  getCurrencyListRequest = async () => {
    return axios({
      method: "get",
      url: `${this.baseUrl}@latest/${this.apiVersion}/currencies.json`,
      headers: { "Content-Type": "application/json" },
    });
  };

  getCurrencyRatesRequest = async (
    selectedDate: Date,
    baseCurrency: string,
  ) => {
    const promises: Promise<any>[] = [];
    commonUtils.getPreviousDays(selectedDate).map((date) => {
      promises.push(axios.get(`${this.baseUrl}@${date}/${this.apiVersion}/currencies/${baseCurrency}.json`))
    })
    
    const promisesResolved = promises.map(promise => promise.catch(error => ({ error })))

    return axios.all(promisesResolved);
  };
}

const currencyService = new CurrencyService();

export default currencyService;
