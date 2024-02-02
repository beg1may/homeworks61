import React, {useEffect, useState} from 'react';
import axios from "axios";

interface Country {
    alpha3Code: string;
    name: string;
}

interface CountryInfo {
    name: string;
    capital: string;
}

const API_URL = 'https://restcountries.com/v2/all?fields=alpha3Code,name';
const URL = 'https://restcountries.com/v2/alpha/';

const CountryInfo: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (selectedCountry) {
            setLoading(true);
            axios.get(`${URL}${selectedCountry}`)
                .then(response => {
                    setCountryInfo(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching country info:', error);
                    setLoading(false);
                });
        }
    }, [selectedCountry]);

    return (
        <div className="country">
            <div>
                <h2>Выберите страну</h2>
                <ul>
                    {countries.map(country => (
                        <li key={country.alpha3Code} onClick={() => setSelectedCountry(country.alpha3Code)}>
                            {country.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Информация о стране</h2>
                {selectedCountry && !loading ? (
                    <div>
                        <p>Страна: {countryInfo?.name || 'Нет данных'}</p>
                        <p>Столица: {countryInfo?.capital || 'Нет данных'}</p>
                    </div>
                ) : (
                    <p>{loading ? 'Загрузка' : 'Выберите страну'}</p>
                )}
            </div>
        </div>
    );
};

export default CountryInfo;