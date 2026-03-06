import { useEffect, useState } from 'react'
import './meteo.css'

export default function App() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("lastCity");
    return saved ? JSON.parse(saved) : "";
  });

  const [state, setState] = useState("loading");

  useEffect(() => {
    fetch('https://dummyjson.com/test/?delay=2000')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setState("loaded");
      }).catch(error => {setState("error"); setLocation(JSON.parse(localStorage.getItem("lastCity"))) });
  }, [])

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetch(
        `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=nom`
      ).then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const temp = Math.floor(Math.random() * 16) + 5;
            let description = "";

            if (temp > 5 && temp <= 10) {
              description = "Nuageux";
            } else if (temp > 10 && temp <= 15) {
              description = "Pluvieux";
            } else {
              description = "Ensoleillé";
            }

            const newCity = {
              city: data[0].nom,
              pays: "France",
              temp: temp,
              description: description,
            };

            setLocation(newCity);
            localStorage.setItem("lastCity", JSON.stringify(newCity));
          }
        })
    })
  }

  const handleValidSearch = (city) => {
    if (city == "") return;

    const temp = Math.floor(Math.random() * 16) + 5;
    let description = "Ensoleillé";

    if (temp > 5 && temp <= 10) {
      description = "Nuageux";
    } else if (temp > 10 && temp <= 15) {
      description = "Pluvieux";
    } else if (temp > 15) {
      description = "Ensoleillé";
    }

    const newCity = {
      city: city,
      pays: "France",
      temp: temp,
      description: description,
    }

    setLocation(newCity);
    localStorage.setItem("lastCity", JSON.stringify(newCity));
  }

  return (
    <>
      <button onClick={() => { handleGetLocation() }}>Utiliser la position de l'appareil</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop: '20px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Rechercher"
          style={{ border: 'none' }}
        />
        <button onClick={() => { handleValidSearch(city) }}>Rechercher</button>
      </div>

      {state == "loading" && (
        <>
          <p>Chargement des données...</p>
        </>
      )}

      {state == "error" && (
        <>
          <p> <strong>Erreur dans le chargement des données.</strong> <br></br> Dernière recherche effectuée :</p>
        </>
      )}

      {location !== "" && (
        <>
          <p><strong>{location.city.toUpperCase()}</strong> - {location.pays}</p>
          <hr />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ margin: 0, fontSize: '2em' }}><strong>{location.temp}°C</strong></p>
              <p style={{ margin: 0 }}>{location.description}</p>
            </div>
            {(location.description == "Nuageux" || location.description == "Pluvieux") && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '48px', height: '48px', padding: '10px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                </svg>
              </>
            )}
            {location.description == "Ensoleillé" && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{ width: '48px', height: '48px', padding: '10px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </>
            )}
          </div>
          <hr />
        </>
      )}
    </>
  )
}

