// SaltItem.js
import React, { useEffect, useState } from "react";
import SaltSelect from "./SaltSelect";

function SaltItem({ salt }) {
  const saltForms = salt.salt_forms_json;
  console.log("updated salt",salt)

  useEffect(() => {
    const defaultForm = Object.keys(saltForms)[0] || null;
    const defaultStrength = defaultForm
    ? Object.keys(saltForms[defaultForm])[0]
    : null;
    const defaultPackage = defaultStrength
    ? Object.keys(saltForms[defaultForm][defaultStrength])[0]
    : null;
    setSelectedForm(defaultForm);
    setSelectedStrength(defaultStrength);
    setSelectedPackage(defaultPackage);
  }, [saltForms]);


  const [selectedForm, setSelectedForm] = useState('');
  const [selectedStrength, setSelectedStrength] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  const [showAllForms, setShowAllForms] = useState(false);
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllPackaging, setShowAllPackaging] = useState(false);

  const renderFormButtons = () => {
    const forms = Object.keys(saltForms);
    const visibleForms = showAllForms ? forms : forms.slice(0, 4);

    const toggleShowAllForms = () => {
      setShowAllForms(!showAllForms);
    };

    return (
      <>
        {visibleForms.map((form, index) => {
          const formStrengths = saltForms[form];
          const hasSellingPrice = Object.values(formStrengths).some(
            (strength) => {
              const packagingKeys = Object.keys(strength);
              return packagingKeys.some((packaging) => {
                const packagingProducts = strength[packaging] || {};
                return Object.values(packagingProducts).some(
                  (productInfo) =>
                    productInfo &&
                    Array.isArray(productInfo) &&
                    productInfo.some(
                      (info) => info && info.pharmacy_id && info.selling_price
                    )
                );
              });
            }
          );

          return (
            <button
              key={index}
              onClick={() => {
                setSelectedForm(form);
                const firstStrength = Object.keys(formStrengths)[0];
                setSelectedStrength(firstStrength);
                const firstPackage = Object.keys(
                  formStrengths[firstStrength]
                )[0];
                setSelectedPackage(firstPackage);
              }}
              className={`${selectedForm === form ? "selected" : ""} ${
                hasSellingPrice ? "available" : "not-avail"
              }`}
            >
              {form}
            </button>
          );
        })}
        {forms.length > 4 && (
          <span onClick={toggleShowAllForms} className="more-btn">
            {showAllForms ? "hide..." : "more..."}
          </span>
        )}
      </>
    );
  };

  const renderStrengthButtons = () => {
    if (selectedForm && saltForms[selectedForm]) {
      const strengthKeys = Object.keys(saltForms[selectedForm]);
      const visibleStrengths = showAllStrengths
        ? strengthKeys
        : strengthKeys.slice(0, 4);

      const toggleShowAllStrengths = () => {
        setShowAllStrengths(!showAllStrengths);
      };

      return (
        <>
          {visibleStrengths.map((strength, index) => {
            const packagingKeys = Object.keys(
              saltForms[selectedForm][strength]
            );
            const hasSellingPrice = packagingKeys.some((packaging) => {
              const packageData = saltForms[selectedForm][strength][packaging];
              return (
                packageData &&
                Object.values(packageData).some(
                  (productInfo) =>
                    productInfo &&
                    Array.isArray(productInfo) &&
                    productInfo.some(
                      (info) => info && info.pharmacy_id && info.selling_price
                    )
                )
              );
            });

            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedStrength(strength);
                  const firstPackage = Object.keys(
                    saltForms[selectedForm][strength]
                  )[0];
                  setSelectedPackage(firstPackage);
                }}
                className={`${
                  selectedStrength === strength ? "selected" : ""
                } ${hasSellingPrice ? "available" : "not-avail"}`}
              >
                {strength}
              </button>
            );
          })}
          {strengthKeys.length > 4 && (
            <span onClick={toggleShowAllStrengths} className="more-btn">
              {showAllStrengths ? "hide..." : "more..."}
            </span>
          )}
        </>
      );
    }
    return null;
  };

  const renderPackagingButtons = () => {
    if (
      selectedForm &&
      selectedStrength &&
      saltForms[selectedForm] &&
      saltForms[selectedForm][selectedStrength]
    ) {
      const packagingKeys = Object.keys(
        saltForms[selectedForm][selectedStrength]
      );
      const visiblePackaging = showAllPackaging
        ? packagingKeys
        : packagingKeys.slice(0, 4);

      const toggleShowAllPackaging = () => {
        setShowAllPackaging(!showAllPackaging);
      };

      return (
        <>
          {visiblePackaging.map((packaging, index) => {
            const packageData =
              saltForms[selectedForm][selectedStrength][packaging];
            const hasSellingPrice =
              packageData &&
              Object.values(packageData).some(
                (productInfo) =>
                  productInfo &&
                  Array.isArray(productInfo) &&
                  productInfo.some(
                    (info) => info && info.pharmacy_id && info.selling_price
                  )
              );

            return (
              <button
                key={index}
                onClick={() => setSelectedPackage(packaging)}
                className={`${
                  selectedPackage === packaging ? "selected" : ""
                } ${hasSellingPrice ? "available" : "not-avail"}`}
              >
                {packaging}
              </button>
            );
          })}
          {packagingKeys.length > 4 && (
            <span onClick={toggleShowAllPackaging} className="more-btn">
              {showAllPackaging
                ? "hide..."
                : "more..."}
            </span>
          )}
        </>
      );
    }
    return null;
  };

  const renderPrice = () => {
    if (
      selectedForm &&
      selectedStrength &&
      saltForms[selectedForm] &&
      saltForms[selectedForm][selectedStrength]
    ) {
      const selectedPackageData =
        saltForms[selectedForm][selectedStrength][selectedPackage];

      let lowestPrice = Number.MAX_VALUE;
      let hasSellingPrice = false;

      Object.values(selectedPackageData).forEach((productInfo) => {
        if (productInfo && Array.isArray(productInfo)) {
          productInfo.forEach((info) => {
            const { pharmacy_id, selling_price } = info || {};
            if (pharmacy_id && selling_price) {
              hasSellingPrice = true;
              if (selling_price < lowestPrice) {
                lowestPrice = selling_price;
              }
            }
          });
        }
      });

      if (hasSellingPrice) {
        return <h2 className="salt-price">From₹{lowestPrice}</h2>;
      } else {
        return (
          <p className="salt-price">No stores selling this product near you</p>
        );
      }
    }
    return null;
  };

  return (
    <>
      <div key={salt.id} className="salt-suggestion">
        <SaltSelect
          renderFormButtons={renderFormButtons}
          renderStrengthButtons={renderStrengthButtons}
          renderPackagingButtons={renderPackagingButtons}
        />
        <div id="salt-main">
          <h4>{salt.salt}</h4>
          <p className="salt-selected-details">
            {selectedForm} | {selectedStrength} | {selectedPackage}
          </p>
        </div>
        <div id="salt-price">{renderPrice()}</div>
      </div>
    </>
  );
}

export default SaltItem;
