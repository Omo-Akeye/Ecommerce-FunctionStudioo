import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaChevronDown } from 'react-icons/fa';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import en from 'react-phone-number-input/locale/en.json';
import * as Flags from 'country-flag-icons/react/3x2';

import type { CountryCode } from 'libphonenumber-js';

interface CheckoutFormData {
  country: string;
  firstName: string;
  secondName: string;
  address: string;
  postcode: string;
  city: string;
  mobile: string;
}

interface CountryOption {
  code: string;
  name: string;
  callingCode: string;
}

const countryList: CountryOption[] = getCountries()
  .map((code) => ({
    code,
    name: (en as Record<string, string>)[code] || code,
    callingCode: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Render dynamic flag SVGs locally (bundled offline assets) to avoid Windows regional indicators text fallback
const getFlagElement = (countryCode: string) => {
  if (!countryCode) return null;
  const FlagComponent = (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[countryCode.toUpperCase()];
  if (!FlagComponent) return null;
  return <FlagComponent title={countryCode} className="w-5 h-3.5 object-cover rounded-xs inline-block" />;
};

const getSafeCountryCallingCode = (code: CountryCode) => {
  try {
    return `+${getCountryCallingCode(code)}`;
  } catch {
    return '';
  }
};

interface DarkSelectProps {
  label: string;
  value: string;
  options: { code: string; name: string }[];
  onChange: (code: string) => void;
}

const DarkSelect = ({ label, value, options, onChange }: DarkSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.code === value);
  const displayName = selectedOption?.name || value;

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const query = search.toLowerCase();
    return options.filter((option) => option.name.toLowerCase().includes(query));
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className="w-full bg-cinder rounded-3xl px-6 flex flex-col justify-center h-14 cursor-pointer text-left"
      >
        <span className="text-[10px] text-gray-300 mt-1">{label}</span>
        <span className="text-white text-sm font-medium -mt-0.5 flex items-center gap-2">
          <span className="shrink-0 flex items-center">{getFlagElement(value)}</span>
          {displayName}
        </span>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
          <FaChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-gunmetal rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-dropdown">
          <div className="p-3 border-b border-white/10">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country..."
              className="w-full bg-graphite text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-custom/40 placeholder-gray-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-sm">No countries found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    onChange(option.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left text-sm transition-colors cursor-pointer ${
                    option.code === value ? 'bg-custom/15 text-custom' : 'text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <span className="shrink-0 flex items-center">{getFlagElement(option.code)}</span>
                  <span className="font-medium">{option.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface PhoneCountrySelectorProps {
  country: CountryCode;
  callingCode: string;
  onChange: (code: string) => void;
}

const PhoneCountrySelector = ({ country, callingCode, onChange }: PhoneCountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search) return countryList;
    const query = search.toLowerCase();
    return countryList.filter(
      (option) => option.name.toLowerCase().includes(query) || option.callingCode.includes(query)
    );
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-35 shrink-0 border-r border-gray-500">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className="w-full h-full px-4 flex flex-col justify-center cursor-pointer text-left"
      >
        <span className="text-[10px] text-gray-300 mt-0.5">Country code*</span>
        <div className="flex items-center gap-2 -mt-0.5">
          <span className="shrink-0 flex items-center">{getFlagElement(country)}</span>
          <span className="text-sm text-white font-medium">{callingCode}</span>
          <FaChevronDown
            size={10}
            className={`text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-[calc(100%+4px)] left-0 w-72 bg-gunmetal rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-dropdown">
          <div className="p-3 border-b border-white/10">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country or code..."
              className="w-full bg-graphite text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-custom/40 placeholder-gray-400"
            />
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-sm">No countries found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    onChange(option.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 text-left text-sm transition-colors cursor-pointer ${
                    option.code === country ? 'bg-custom/15 text-custom' : 'text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <span className="shrink-0 flex items-center">{getFlagElement(option.code)}</span>
                  <span className="font-medium flex-1">{option.name}</span>
                  <span className="text-gray-400 text-xs">{option.callingCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CheckoutForm = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('IT');
  const [mobile, setMobile] = useState('');

  const { register, handleSubmit, setValue } = useForm<CheckoutFormData>({
    defaultValues: {
      country: 'IT',
      firstName: '',
      secondName: '',
      address: '',
      postcode: '',
      city: '',
      mobile: '',
    },
  });

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code as CountryCode);
    setValue('country', code);
  };

  const callingCode = getSafeCountryCallingCode(selectedCountry);

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Form data:', { ...data, mobile: `${callingCode}${mobile}`, country: selectedCountry });
  };

  return (
    <div className="flex flex-col relative w-full max-w-150 mx-auto lg:mx-0">
      <div className="flex flex-col items-center mb-4">
        <span className="text-base font-medium text-white mb-4">Express Payment</span>
        <button className="w-full md:w-67.5 bg-custom hover:bg-yellow-400 text-black rounded-full flex items-center justify-center transition-all cursor-pointer font-semibold">
          <svg width="103" height="40" viewBox="0 0 103 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M41.5102 14.9866H37.1257C36.9806 14.9865 36.8402 15.0382 36.7298 15.1325C36.6194 15.2268 36.5464 15.3574 36.5238 15.5007L34.7505 26.7437C34.7423 26.7959 34.7456 26.8492 34.76 26.9C34.7744 26.9508 34.7997 26.9978 34.8341 27.0379C34.8684 27.078 34.9111 27.1102 34.9591 27.1322C35.0071 27.1542 35.0592 27.1656 35.1121 27.1655H37.2052C37.3505 27.1656 37.491 27.1138 37.6014 27.0194C37.7117 26.925 37.7848 26.7942 37.8072 26.6507L38.2855 23.6183C38.308 23.4749 38.3809 23.3443 38.4911 23.2499C38.6014 23.1555 38.7417 23.1036 38.8868 23.1035H40.2748C43.163 23.1035 44.8298 21.7059 45.2651 18.9364C45.4613 17.7247 45.2735 16.7727 44.7061 16.1059C44.0829 15.3738 42.9777 14.9866 41.5102 14.9866ZM42.016 19.0928C41.7763 20.6661 40.5742 20.6661 39.4119 20.6661H38.7503L39.2144 17.7279C39.228 17.642 39.2719 17.5637 39.338 17.5071C39.4042 17.4506 39.4884 17.4195 39.5754 17.4195H39.8786C40.6704 17.4195 41.4173 17.4195 41.8032 17.8709C42.0334 18.1401 42.1039 18.5402 42.016 19.0928ZM54.6162 19.0422H52.5166C52.4296 19.0422 52.3454 19.0732 52.2792 19.1298C52.2131 19.1863 52.1693 19.2646 52.1557 19.3505L52.0627 19.9378L51.9159 19.7249C51.4614 19.0652 50.4478 18.8447 49.4361 18.8447C47.116 18.8447 45.1344 20.602 44.7484 23.067C44.5477 24.2966 44.833 25.4724 45.5306 26.2923C46.1704 27.0463 47.0859 27.3604 48.1751 27.3604C50.0445 27.3604 51.0812 26.1584 51.0812 26.1584L50.9876 26.7418C50.9792 26.7939 50.9823 26.8473 50.9966 26.8981C51.0108 26.949 51.036 26.9962 51.0702 27.0364C51.1044 27.0766 51.147 27.1089 51.1949 27.1311C51.2429 27.1533 51.2951 27.1648 51.3479 27.1649H53.2391C53.3844 27.165 53.5249 27.1131 53.6352 27.0187C53.7456 26.9243 53.8186 26.7936 53.8411 26.6501L54.9759 19.464C54.9842 19.412 54.9812 19.3587 54.9669 19.308C54.9527 19.2572 54.9276 19.2102 54.8934 19.1701C54.8592 19.1299 54.8167 19.0977 54.7689 19.0757C54.721 19.0536 54.6689 19.0421 54.6162 19.0422ZM51.6896 23.1285C51.487 24.328 50.535 25.1332 49.3207 25.1332C48.711 25.1332 48.2238 24.9377 47.911 24.5672C47.6007 24.1992 47.4827 23.6754 47.5814 23.092C47.7706 21.9027 48.7386 21.0712 49.9343 21.0712C50.5305 21.0712 51.0152 21.2693 51.3344 21.6431C51.6543 22.0207 51.7813 22.5477 51.6896 23.1285ZM65.7982 19.0422H63.6884C63.5889 19.0423 63.4909 19.0668 63.403 19.1133C63.3151 19.1599 63.2399 19.2273 63.1838 19.3095L60.2739 23.5959L59.0404 19.4768C59.0026 19.3512 58.9253 19.2411 58.82 19.1628C58.7147 19.0845 58.587 19.0422 58.4557 19.0422H56.3824C56.3242 19.042 56.2668 19.0558 56.215 19.0823C56.1632 19.1088 56.1185 19.1473 56.0846 19.1946C56.0506 19.2418 56.0285 19.2965 56.02 19.3541C56.0114 19.4117 56.0168 19.4705 56.0356 19.5256L58.3596 26.3456L56.1747 29.4299C56.1359 29.4846 56.1129 29.5489 56.1081 29.6158C56.1034 29.6827 56.1172 29.7496 56.148 29.8092C56.1788 29.8688 56.2254 29.9187 56.2827 29.9536C56.34 29.9885 56.4058 30.0069 56.4728 30.0069H58.5801C58.6785 30.007 58.7755 29.9833 58.8627 29.9377C58.9499 29.8922 59.0247 29.8261 59.0808 29.7453L66.0983 19.6159C66.1363 19.5611 66.1586 19.497 66.1628 19.4304C66.167 19.3638 66.1528 19.2974 66.1219 19.2383C66.091 19.1791 66.0445 19.1296 65.9874 19.0951C65.9304 19.0605 65.865 19.0422 65.7982 19.0422Z" fill="#253B80"/>
            <path d="M72.7838 14.9867H68.3987C68.2536 14.9867 68.1134 15.0385 68.0031 15.1328C67.8929 15.2271 67.8199 15.3576 67.7973 15.5008L66.024 26.7438C66.0158 26.7959 66.0189 26.8491 66.0332 26.8999C66.0475 26.9506 66.0727 26.9976 66.1069 27.0377C66.1412 27.0778 66.1837 27.11 66.2316 27.1321C66.2795 27.1542 66.3316 27.1656 66.3843 27.1656H68.6346C68.7361 27.1655 68.8342 27.1291 68.9113 27.0631C68.9884 26.997 69.0394 26.9056 69.0551 26.8053L69.5584 23.6184C69.5809 23.475 69.6538 23.3444 69.764 23.25C69.8743 23.1556 70.0146 23.1037 70.1598 23.1036H71.5471C74.4359 23.1036 76.1021 21.706 76.538 18.9365C76.7349 17.7248 76.5457 16.7728 75.9784 16.106C75.3559 15.3739 74.2512 14.9867 72.7838 14.9867ZM73.2896 19.0929C73.0505 20.6662 71.8484 20.6662 70.6855 20.6662H70.0245L70.4893 17.728C70.5026 17.642 70.5463 17.5637 70.6123 17.5071C70.6784 17.4506 70.7626 17.4195 70.8496 17.4196H71.1528C71.9439 17.4196 72.6914 17.4196 73.0774 17.871C73.3075 18.1402 73.3774 18.5403 73.2896 19.0929ZM85.8891 19.0423H83.7908C83.7038 19.042 83.6195 19.073 83.5534 19.1296C83.4873 19.1862 83.4437 19.2646 83.4305 19.3506L83.3375 19.9379L83.1901 19.725C82.7355 19.0653 81.7226 18.8448 80.711 18.8448C78.3908 18.8448 76.4098 20.602 76.0239 23.0671C75.8239 24.2967 76.1079 25.4725 76.8054 26.2924C77.4465 27.0464 78.3607 27.3605 79.4499 27.3605C81.3194 27.3605 82.356 26.1584 82.356 26.1584L82.2624 26.7418C82.2541 26.7941 82.2571 26.8476 82.2715 26.8985C82.2858 26.9495 82.3111 26.9967 82.3454 27.037C82.3798 27.0772 82.4226 27.1095 82.4706 27.1316C82.5187 27.1537 82.5711 27.1651 82.624 27.165H84.5146C84.6597 27.1649 84.8001 27.113 84.9103 27.0186C85.0206 26.9242 85.0935 26.7936 85.1159 26.6502L86.2513 19.4641C86.2594 19.4119 86.256 19.3586 86.2415 19.3078C86.227 19.257 86.2017 19.2099 86.1673 19.1698C86.1329 19.1298 86.0902 19.0976 86.0422 19.0756C85.9941 19.0536 85.9419 19.0422 85.8891 19.0423ZM82.9625 23.1286C82.7612 24.3281 81.8079 25.1333 80.5936 25.1333C79.9852 25.1333 79.4967 24.9378 79.1839 24.5672C78.8736 24.1993 78.7569 23.6755 78.8543 23.0921C79.0447 21.9028 80.0115 21.0713 81.2072 21.0713C81.8034 21.0713 82.2881 21.2694 82.6073 21.6432C82.9285 22.0208 83.0555 22.5478 82.9625 23.1286ZM88.3644 15.295L86.5648 26.7438C86.5566 26.7959 86.5597 26.8491 86.574 26.8999C86.5884 26.9506 86.6135 26.9976 86.6477 27.0377C86.682 27.0778 86.7245 27.11 86.7724 27.1321C86.8203 27.1542 86.8724 27.1656 86.9251 27.1656H88.7343C89.035 27.1656 89.2901 26.9476 89.3363 26.6508L91.1109 15.4085C91.1191 15.3564 91.116 15.3031 91.1016 15.2523C91.0873 15.2016 91.0622 15.1545 91.028 15.1143C90.9937 15.0742 90.9512 15.0419 90.9033 15.0198C90.8554 14.9976 90.8033 14.9861 90.7506 14.986H88.7247C88.6377 14.9863 88.5537 15.0176 88.4877 15.0742C88.4216 15.1308 88.3779 15.2091 88.3644 15.295Z" fill="#179BD7"/>
            <path d="M16.5425 29.3504L16.8778 27.2207L16.1309 27.2034H12.5645L15.0429 11.4881C15.0503 11.4401 15.0747 11.3963 15.1117 11.3648C15.1486 11.3332 15.1957 11.316 15.2442 11.3163H21.2578C23.2541 11.3163 24.6319 11.7317 25.3512 12.5517C25.6884 12.9363 25.9032 13.3383 26.007 13.7807C26.116 14.2448 26.1179 14.7994 26.0115 15.4757L26.0038 15.5251V15.9585L26.341 16.1495C26.5985 16.28 26.8299 16.4564 27.0238 16.6701C27.3123 16.999 27.4989 17.417 27.5777 17.9126C27.6591 18.4222 27.6322 19.0287 27.4989 19.7153C27.345 20.5052 27.0962 21.1931 26.7603 21.7559C26.4639 22.2602 26.0654 22.6969 25.5903 23.0381C25.1441 23.3548 24.6139 23.5953 24.0145 23.7491C23.4336 23.9004 22.7714 23.9767 22.045 23.9767H21.577C21.2424 23.9767 20.9173 24.0972 20.6622 24.3133C20.4074 24.5316 20.2384 24.8333 20.1852 25.1647L20.1499 25.3563L19.5576 29.11L19.5306 29.2478C19.5236 29.2914 19.5114 29.3132 19.4935 29.328C19.4761 29.3422 19.4544 29.3501 19.4319 29.3504H16.5425Z" fill="#253B80"/>
            <path d="M26.6603 15.5751C26.6423 15.6898 26.6218 15.8072 26.5987 15.9277C25.8057 19.9993 23.0925 21.4059 19.6274 21.4059H17.8631C17.4393 21.4059 17.0822 21.7136 17.0162 22.1316L16.1129 27.8604L15.8571 29.4844C15.8469 29.5488 15.8508 29.6146 15.8685 29.6774C15.8862 29.7402 15.9173 29.7983 15.9597 29.8479C16.002 29.8975 16.0546 29.9374 16.1138 29.9647C16.173 29.992 16.2375 30.0062 16.3027 30.0062H19.4319C19.8024 30.0062 20.1172 29.7369 20.1755 29.3715L20.2063 29.2125L20.7955 25.4736L20.8333 25.2685C20.891 24.9018 21.2064 24.6325 21.577 24.6325H22.045C25.0767 24.6325 27.4501 23.4016 28.1438 19.8397C28.4335 18.3517 28.2835 17.1092 27.5168 16.2354C27.2737 15.9651 26.9835 15.7413 26.6603 15.5751Z" fill="#179BD7"/>
            <path d="M25.832 15.2443C25.5788 15.1711 25.3212 15.1139 25.0608 15.0732C24.5462 14.9941 24.0261 14.9561 23.5055 14.9597H18.7921C18.6128 14.9596 18.4393 15.0236 18.303 15.1402C18.1667 15.2569 18.0767 15.4184 18.0491 15.5957L17.0464 21.9464L17.0176 22.1317C17.0488 21.9295 17.1514 21.7452 17.3067 21.6121C17.4621 21.479 17.6599 21.4058 17.8645 21.4059H19.6288C23.0939 21.4059 25.807 19.9987 26.6001 15.9278C26.6238 15.8072 26.6437 15.6899 26.6616 15.5752C26.4524 15.4654 26.2343 15.3734 26.0096 15.3001C25.9507 15.2806 25.8915 15.262 25.832 15.2443Z" fill="#222D65"/>
            <path d="M18.0482 15.5957C18.0755 15.4184 18.1655 15.2568 18.3019 15.1402C18.4382 15.0236 18.6119 14.9598 18.7913 14.9603H23.5046C24.063 14.9603 24.5842 14.9969 25.0599 15.0738C25.3818 15.1244 25.6993 15.2001 26.0094 15.3001C26.2434 15.3777 26.4607 15.4694 26.6614 15.5752C26.8973 14.0705 26.6595 13.046 25.8459 12.1184C24.949 11.0971 23.3302 10.6599 21.2589 10.6599H15.2453C14.8222 10.6599 14.4613 10.9676 14.3959 11.3862L11.8911 27.263C11.8795 27.3367 11.8839 27.4121 11.9041 27.4839C11.9244 27.5558 11.9599 27.6224 12.0084 27.6791C12.0568 27.7359 12.117 27.7815 12.1847 27.8129C12.2524 27.8442 12.3262 27.8604 12.4008 27.8605H16.1134L17.0456 21.9464L18.0482 15.5957Z" fill="#253B80"/>
          </svg>
        </button>

        <div className="flex items-center gap-4 w-full mt-4">
          <div className="h-px bg-cart-border flex-1"></div>
          <span className="text-white text-sm">OR</span>
          <div className="h-px bg-cart-border flex-1"></div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-custom"></div>
          <h2 className=" text-custom font-medium">Delivery Address</h2>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <DarkSelect label="Country*" value={selectedCountry} options={countryList} onChange={handleCountryChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-cinder rounded-[29.53px] px-6 h-14 flex items-center">
              <input
                {...register('firstName')}
                type="text"
                placeholder="First name *"
                className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-pearl font-medium"
              />
            </div>
            <div className="bg-cinder rounded-[29.53px] px-6 h-14 flex items-center">
              <input
                {...register('secondName')}
                type="text"
                placeholder="Second name *"
                className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-pearl font-medium"
              />
            </div>
          </div>

          <div className="bg-cinder rounded-[29.53px] px-6 h-14 flex items-center">
            <input
              {...register('address')}
              type="text"
              placeholder="Number and address*"
              className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-pearl font-medium"
            />
          </div>

          <div className="flex justify-end py-2">
            <button
              type="button"
              className="text-sm text-white hover:text-gray-300 transition-colors cursor-pointer underline underline-offset-4"
            >
              + Additional fields (optional)
            </button>
          </div>

          <div className="grid grid-cols-[1fr_0.8fr] gap-5">
            <div className="bg-cinder rounded-[29.53px] px-6 h-14 flex items-center">
              <input
                {...register('postcode')}
                type="text"
                placeholder="Postcode*"
                className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-pearl font-medium"
              />
            </div>
            <div className="bg-cinder rounded-[29.53px] px-6 h-14 flex items-center">
              <input
                {...register('city')}
                type="text"
                placeholder="City*"
                className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-pearl font-medium"
              />
            </div>
          </div>

          <div className="flex bg-cinder rounded-[29.53px] h-14 relative">
            <PhoneCountrySelector country={selectedCountry} callingCode={callingCode} onChange={handleCountryChange} />

            <div className="flex-1 px-4 flex flex-col justify-center">
              <input
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                type="tel"
                placeholder="Enter number"
                className="w-full bg-transparent text-white focus:outline-none text-sm placeholder-gray-400 font-medium -mt-0.5"
              />
            </div>
          </div>
        </form>
      </div>

      <button
        form="checkout-form"
        type="submit"
        className="w-full bg-custom hover:bg-yellow-400 text-black font-semibold uppercase tracking-wider py-2 rounded-[29.53px] mb-10 transition-all cursor-pointer flex justify-center"
      >
        <span className="underline underline-offset-4 decoration-black font-semibold">VALIDATE</span>
      </button>

      <div>
        <div className="flex items-center justify-between mb-7.75">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-custom"></div>
            <h2 className="text-lg text-custom font-medium">Payment</h2>
          </div>
          <div className="flex gap-2 text-2xl">
            <div><svg width="54" height="18" viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_2945_21718" style={{ maskType: 'luminance' as React.CSSProperties['maskType'] }} maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="18">
<path d="M27.5948 5.50839C27.5644 7.90849 29.7338 9.24794 31.368 10.0442C33.0471 10.8614 33.6111 11.3853 33.6047 12.1159C33.5919 13.2342 32.2652 13.7277 31.0235 13.7469C28.8573 13.7806 27.598 13.1621 26.5966 12.6943L25.8164 16.3457C26.8209 16.8088 28.6811 17.2125 30.6102 17.2301C35.138 17.2301 38.1005 14.9951 38.1165 11.5295C38.1341 7.13142 32.0329 6.88789 32.0746 4.92198C32.089 4.32596 32.6578 3.68988 33.9043 3.52806C34.5211 3.44635 36.2243 3.38386 38.155 4.27309L38.9128 0.740221C37.8746 0.362101 36.5399 0 34.8784 0C30.6166 0 27.6188 2.26552 27.5948 5.50839ZM46.1948 0.304419C45.3681 0.304419 44.6711 0.786684 44.3603 1.5269L37.8922 16.9706H42.4168L43.3173 14.4823H48.8465L49.3688 16.9706H53.3567L49.8767 0.304419H46.1948ZM46.8277 4.80662L48.1335 11.0648H44.5574L46.8277 4.80662ZM22.1089 0.304419L18.5423 16.9706H22.8539L26.4188 0.304419H22.1089ZM15.7305 0.304419L11.2427 11.648L9.42739 2.00276C9.2143 0.926075 8.37314 0.304419 7.43905 0.304419H0.10255L0 0.788284C1.50607 1.11514 3.21723 1.64226 4.25386 2.20624C4.88833 2.55072 5.06938 2.85193 5.27766 3.67066L8.71601 16.9706H13.2727L20.2583 0.304419H15.7305Z" fill="white"/>
</mask>
<g mask="url(#mask0_2945_21718)">
<path d="M-5.58789 2.05789L46.9843 -17.3032L58.9442 15.173L6.37258 34.5341" fill="white"/>
</g>
</svg>
</div>

      <div>
        <svg width="70" height="47" viewBox="0 0 70 47" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.3691 11.0447H42.2624V35.3698H27.3691V11.0447Z" fill="#FF5F00"/>
<path d="M28.9043 23.2091C28.9025 20.8668 29.4335 18.5548 30.4571 16.448C31.4807 14.3412 32.9701 12.4949 34.8127 11.0487C32.5306 9.25526 29.79 8.14001 26.9041 7.83044C24.0182 7.52086 21.1034 8.02946 18.4929 9.29809C15.8823 10.5667 13.6814 12.5442 12.1416 15.0045C10.6017 17.4649 9.78516 20.3088 9.78516 23.2112C9.78516 26.1137 10.6017 28.9576 12.1416 31.4179C13.6814 33.8783 15.8823 35.8558 18.4929 37.1244C21.1034 38.393 24.0182 38.9016 26.9041 38.592C29.79 38.2825 32.5306 37.1672 34.8127 35.3738C32.9696 33.9271 31.4798 32.0801 30.4561 29.9725C29.4325 27.8649 28.9018 25.5521 28.9043 23.209V23.2091Z" fill="#EB001B"/>
<path d="M58.3628 32.7956V32.2973H58.5777V32.1941H58.0664V32.2973H58.2684V32.7957L58.3628 32.7956ZM59.3555 32.7956V32.1942H59.2008L59.0203 32.6238L58.8398 32.1941H58.6852V32.7956H58.7969V32.3402L58.9645 32.7313H59.0805L59.2481 32.3402V32.7956H59.3555Z" fill="#F79E1B"/>
<path d="M59.8423 23.2091C59.8423 26.1118 59.0255 28.9559 57.4854 31.4163C55.9453 33.8768 53.744 35.8542 51.1331 37.1227C48.5223 38.3911 45.6072 38.8994 42.7211 38.5893C39.835 38.2793 37.0944 37.1635 34.8125 35.3695C36.6543 33.922 38.1433 32.0752 39.1672 29.9683C40.1911 27.8614 40.7231 25.5495 40.7231 23.207C40.7231 20.8644 40.1911 18.5525 39.1672 16.4456C38.1433 14.3387 36.6543 12.4919 34.8125 11.0444C37.0944 9.2504 39.835 8.1346 42.7211 7.82458C45.6072 7.51455 48.5223 8.02282 51.1332 9.29127C53.744 10.5597 55.9453 12.5372 57.4854 14.9976C59.0255 17.458 59.8423 20.3022 59.8423 23.2048V23.2091Z" fill="#F79E1B"/>
</svg>

      </div>
          </div>
        </div>

        <p className="text-xs text-mist leading-relaxed text-justify">
          By creating an account or placing an order, you agree to the{' '}
          <a href="#" className="underline  hover:text-white transition-colors">
            General Terms and Conditions of Sale
          </a>{' '}
          and consent to the processing of your data, in accordance with the Typology{' '}
          <a href="#" className="underline  hover:text-white transition-colors">
            Privacy Policy
          </a>
          .<br />
          <br />
          The information concerning you is intended for our company Good Brands SAS, responsible for the processing,
          in order to place your orders, and to send you offers and communications Typology by email, SMS and
          WhatsApp. Your personal data may also be shared between the Good Brands Group brands for the purpose of
          personalizing offers and improving your customer experience. In accordance with the Personal Data
          Regulations, you have the right to access, rectify, and object to the processing of your data. To exercise
          your rights, simply write to{' '}
          <a href="mailto:hello+fr@typology.com" className="underline  hover:text-white transition-colors">
            hello+fr@typology.com
          </a>{' '}
          indicating last name, first name, address, email and proof of identity. You can unsubscribe at any time by
          clicking on the unsubscribe link at the bottom of all our communications. You can find all the additional
          information on our{' '}
          <a href="#" className="underline  hover:text-white transition-colors">
            Frequently Asked Questions
          </a>{' '}
          page.
        </p>
      </div>
    </div>
  );
};