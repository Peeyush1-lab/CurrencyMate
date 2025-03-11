const apiKey = '344d9cd75c9cb95ce69d59cc';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultText = document.getElementById('resultText');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

let currencies = [];

const currencyToCountry = {
  AED: 'AE', AFN: 'AF', ALL: 'AL', AMD: 'AM', ANG: 'CW', AOA: 'AO', ARS: 'AR', AUD: 'AU', AWG: 'AW', AZN: 'AZ',
  BAM: 'BA', BBD: 'BB', BDT: 'BD', BGN: 'BG', BHD: 'BH', BIF: 'BI', BMD: 'BM', BND: 'BN', BOB: 'BO', BRL: 'BR',
  BSD: 'BS', BTN: 'BT', BWP: 'BW', BYN: 'BY', BZD: 'BZ', CAD: 'CA', CDF: 'CD', CHF: 'CH', CLP: 'CL', CNY: 'CN',
  COP: 'CO', CRC: 'CR', CUP: 'CU', CVE: 'CV', CZK: 'CZ', DJF: 'DJ', DKK: 'DK', DOP: 'DO', DZD: 'DZ', EGP: 'EG',
  ERN: 'ER', ETB: 'ET', EUR: 'EU', FJD: 'FJ', FKP: 'FK', FOK: 'FO', GBP: 'GB', GEL: 'GE', GGP: 'GG', GHS: 'GH',
  GIP: 'GI', GMD: 'GM', GNF: 'GN', GTQ: 'GT', GYD: 'GY', HKD: 'HK', HNL: 'HN', HRK: 'HR', HTG: 'HT', HUF: 'HU',
  IDR: 'ID', ILS: 'IL', IMP: 'IM', INR: 'IN', IQD: 'IQ', IRR: 'IR', ISK: 'IS', JEP: 'JE', JMD: 'JM', JOD: 'JO',
  JPY: 'JP', KES: 'KE', KGS: 'KG', KHR: 'KH', KID: 'KI', KMF: 'KM', KRW: 'KR', KWD: 'KW', KYD: 'KY', KZT: 'KZ',
  LAK: 'LA', LBP: 'LB', LKR: 'LK', LRD: 'LR', LSL: 'LS', LYD: 'LY', MAD: 'MA', MDL: 'MD', MGA: 'MG', MKD: 'MK',
  MMK: 'MM', MNT: 'MN', MOP: 'MO', MRU: 'MR', MUR: 'MU', MVR: 'MV', MWK: 'MW', MXN: 'MX', MYR: 'MY', MZN: 'MZ',
  NAD: 'NA', NGN: 'NG', NIO: 'NI', NOK: 'NO', NPR: 'NP', NZD: 'NZ', OMR: 'OM', PAB: 'PA', PEN: 'PE', PGK: 'PG',
  PHP: 'PH', PKR: 'PK', PLN: 'PL', PYG: 'PY', QAR: 'QA', RON: 'RO', RSD: 'RS', RUB: 'RU', RWF: 'RW', SAR: 'SA',
  SBD: 'SB', SCR: 'SC', SDG: 'SD', SEK: 'SE', SGD: 'SG', SHP: 'SH', SLL: 'SL', SOS: 'SO', SRD: 'SR', SSP: 'SS',
  STN: 'ST', SYP: 'SY', SZL: 'SZ', THB: 'TH', TJS: 'TJ', TMT: 'TM', TND: 'TN', TOP: 'TO', TRY: 'TR', TTD: 'TT',
  TVD: 'TV', TWD: 'TW', TZS: 'TZ', UAH: 'UA', UGX: 'UG', USD: 'US', UYU: 'UY', UZS: 'UZ', VES: 'VE', VND: 'VN',
  VUV: 'VU', WST: 'WS', XAF: 'CM', XCD: 'AG', XDR: 'IMF', XOF: 'SN', XPF: 'PF', YER: 'YE', ZAR: 'ZA', ZMW: 'ZM',
  ZWL: 'ZW',
};

async function fetchCurrencies() {
  try {
    console.log('Fetching currency data...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('API Response:', data);

    if (!data.conversion_rates) {
      throw new Error('Invalid API response, conversion_rates missing');
    }

    currencies = Object.keys(data.conversion_rates);
    console.log('Currencies:', currencies);

    populateDropdowns();
    updateFlags();
  } catch (error) {
    console.error('Error fetching currencies:', error);
  }
}

function populateDropdowns() {
  fromCurrency.innerHTML = ''; // Clear before appending
  toCurrency.innerHTML = '';

  currencies.forEach(currency => {
    const option1 = document.createElement('option');
    option1.value = currency;
    option1.textContent = currency;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = currency;
    option2.textContent = currency;
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = 'USD'; // Default selection
  toCurrency.value = 'INR';

  updateFlags();
}

async function convertCurrency() {
  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  console.log(`Converting ${amount} ${from} to ${to}...`);

  if (!amount || isNaN(amount)) {
    resultText.textContent = 'Please enter a valid amount';
    return;
  }

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
    const data = await response.json();
    console.log('Conversion API Response:', data);

    if (!data.conversion_result) {
      throw new Error('Invalid conversion response');
    }

    const result = data.conversion_result.toFixed(2);
    resultText.textContent = `${amount} ${from} = ${result} ${to}`;
  } catch (error) {
    console.error('Error converting currency:', error);
    resultText.textContent = 'Conversion failed. Please try again.';
  }
}

function getFlagUrl(currency) {
  const countryCode = currencyToCountry[currency];
  if (countryCode) {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  }
  return '';
}

function updateFlags() {
  const fromCurrencyCode = fromCurrency.value;
  const toCurrencyCode = toCurrency.value;

  console.log('Selected From Currency:', fromCurrencyCode);
  console.log('Selected To Currency:', toCurrencyCode);

  const fromFlagUrl = getFlagUrl(fromCurrencyCode);
  const toFlagUrl = getFlagUrl(toCurrencyCode);

  console.log('From Flag URL:', fromFlagUrl);
  console.log('To Flag URL:', toFlagUrl);

  fromFlag.src = fromFlagUrl || 'https://via.placeholder.com/40';
  toFlag.src = toFlagUrl || 'https://via.placeholder.com/40';
}

convertBtn.addEventListener('click', convertCurrency);
fromCurrency.addEventListener('change', updateFlags);
toCurrency.addEventListener('change', updateFlags);

fetchCurrencies();
