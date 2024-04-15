export interface Countries {}

export interface UnkownProps {
  [key: string]: string;
}

export interface CountriesRates extends UnkownProps {
  code: string;
  name: string;
}

export interface DropdownValues {
  label: string;
  value: string;
}
