/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { CheckPicker, SelectPicker, Button, Table, DatePicker, IconButton } from "rsuite";
import TrashIcon from '@rsuite/icons/Trash';
import { subDays } from 'date-fns';
import currencyService from "../../services/currency.service";
import { CountriesRates, DropdownValues } from "../../interfaces/Currency";
import commonUtils from "../../utils/CommonUtils";

const { Column, HeaderCell, Cell } = Table;

const CurrencyRate = () => {
  const [isLoading, setLoading] = useState(false);
  const [currencyListAll, setCurrencyListAll] = useState<any>({});
  const [currencyList, setCurrencyList] = useState<DropdownValues[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>("gbp");
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([
    "usd",
    "eur",
    "jpy",
    "chf",
    "cad",
    "aud",
    "inr",
  ]);
  const [currencyRates, setCurrencyRates] = useState<CountriesRates[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const initCurrencyList = async () => {
    try {
      const response = await currencyService.getCurrencyListRequest();
      const currencies = response?.data || {};
      const _currencyList: DropdownValues[] = [];
      Object.keys(currencies).map((key: string) => {
        const label = currencies[key];
        if (label) {
          _currencyList.push({
            label: `${key.toUpperCase()} - ${label}`,
            value: key,
          });
        }
      });
      setCurrencyList(_currencyList);
      setCurrencyListAll(currencies);
    } catch (_error) {}
  };


  const getCurrencyRates = async () => {
    setLoading(true);
    try {
      currencyService.getCurrencyRatesRequest(
        selectedDate,
        baseCurrency,
      ).then((responses) => {
        const _currencyRatesList: CountriesRates[] = [];
        selectedCurrencies.map((currency: string) => {
          _currencyRatesList.push({
            code: currency.toUpperCase(),
            name: currencyListAll[currency],
          });
        });
        responses.map((response: any) => {
          if (response.status === 200 && response.data) {
            const _currencyRates = response?.data || {};
            selectedCurrencies.map((currency: string, index) => {
              _currencyRatesList[index][_currencyRates.date] = _currencyRates[baseCurrency][currency]
            });
          }
        })
        setCurrencyRates(_currencyRatesList);
        setLoading(false);
      }).catch((err) => {
      });
    } catch (_error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    initCurrencyList();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="form-controls">
          <div className="form-control">
            <div className="control-label">Base Currency</div>
            <SelectPicker
              data={currencyList}
              style={{ width: 224 }}
              value={baseCurrency}
              onSelect={(value) => {
                setBaseCurrency(value);
              }}
              onClose={() => {}}
            />
          </div>
          <div className="form-control">
            <div className="control-label">Currencies:</div>
            <CheckPicker
              data={currencyList}
              style={{ width: 550 }}
              cleanable={false}
              value={selectedCurrencies}
              onSelect={(values) => {
                if (values.length >= 3 && values.length <= 7) {
                  setSelectedCurrencies(values);
                }
              }}
            />
          </div>
          <div className="form-control">
            <div className="control-label">Date:</div>
            <DatePicker
              value={selectedDate}
              cleanable={false}
              shouldDisableDate={(date) => date > new Date() || date < subDays(new Date(), 90)}
              onSelect={(value) => {
                setSelectedDate(value);
              }}
            />
          </div>
          <div className="form-control">
            <Button appearance="primary" onClick={getCurrencyRates}>
              Get Rates
            </Button>
          </div>
        </div>
      </div>
      <div className="page-body">
        <Table
          bordered
          cellBordered
          autoHeight
          loading={isLoading}
          data={currencyRates}
        >
          <Column width={120}>
            <HeaderCell>Currency</HeaderCell>
            <Cell dataKey="code" />
          </Column>

          <Column width={200}>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          {commonUtils.getPreviousDays(selectedDate).map((date) => {
            return  (
              <Column width={140} key={date}>
                <HeaderCell>{date}</HeaderCell>
                <Cell dataKey={date} align="right" />
              </Column>
            )
          })}

          <Column width={80}>
            <HeaderCell>&nbsp;</HeaderCell>
            <Cell dataKey="action" align="center">
              {(rowData, index) => (
                <IconButton
                  size="xs"
                  icon={<TrashIcon />}
                  disabled={currencyRates.length <= 3}
                  onClick={() => {
                    if (typeof index === "number") {
                      currencyRates.splice(index, 1);
                      setCurrencyRates([...currencyRates]);
                      setSelectedCurrencies([
                        ...selectedCurrencies.filter(
                          (currency) => currency !== rowData.code.toLowerCase()
                        ),
                      ]);
                    }
                  }}
                >
                </IconButton>
              )}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default CurrencyRate;
