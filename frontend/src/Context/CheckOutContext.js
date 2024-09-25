import React, { createContext, useState, useEffect, useContext } from "react";

// Create a context
const LocationContext = createContext();

// Create a provider component
export const LocationProvider = ({ children }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [showProvinces, setShowProvinces] = useState(false);
  const [showDistricts, setShowDistricts] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://api.npoint.io/ac646cb54b295b9555be"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            "https://api.npoint.io/34608ea16bebc5cffd42"
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          const filteredDistricts = data.filter(
            (district) => district.ProvinceId === parseInt(selectedProvince)
          );
          setDistricts(filteredDistricts);
          setSelectedDistrict("");
          setWards([]);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrict("");
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            "https://api.npoint.io/dd278dc276e65c68cdf5"
          );
          const data = await response.json();
          const filteredWards = data.filter(
            (ward) => ward.DistrictId === parseInt(selectedDistrict)
          );
          setWards(filteredWards);
          setSelectedWard("");
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  const handleProvinceClick = (id, Name) => {
    setSelectedLocation((prev) => ({
      ...prev,
      province: Name,
      district: "", // Clear district when province changes
      ward: "", // Clear ward when province changes
    }));
    setSelectedProvince(id);
    setShowProvinces(false);
  };

  const handleDistrictClick = (id, Name) => {
    setSelectedLocation((prev) => ({
      ...prev,
      district: Name,
      ward: "", // Clear ward when district changes
    }));
    setSelectedDistrict(id);
    setShowDistricts(false);
  };

  const handleWardClick = (id, Name) => {
    setSelectedLocation((prev) => ({
      ...prev,
      ward: Name,
    }));
    setSelectedWard(id);
    setShowWards(false);
  };

  const handleAddressChange = (e) => {
    setSelectedLocation((prev) => ({ ...prev, address: e.target.value }));
  };

  return (
    <LocationContext.Provider
      value={{
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        showProvinces,
        showDistricts,
        showWards,
        selectedLocation,
        setShowProvinces,
        setShowDistricts,
        setShowWards,
        handleProvinceClick,
        handleDistrictClick,
        handleWardClick,
        handleAddressChange,
        setSelectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the LocationContext
export const useLocation = () => useContext(LocationContext);
