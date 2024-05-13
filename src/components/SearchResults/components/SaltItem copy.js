// SaltItem.js
import React, { useState } from "react";
import SaltSelect from "./SaltSelect";

function SaltItem({ salt }) {
  const saltForms = salt.salt_forms_json;

  const defaultForm = Object.keys(saltForms)[0] || null;
  const defaultStrength = defaultForm
    ? Object.keys(saltForms[defaultForm])[0]
    : null;
  const defaultPackage = defaultStrength
    ? Object.keys(saltForms[defaultForm][defaultStrength])[0]
    : null;

  const [selectedForm, setSelectedForm] = useState(defaultForm);
  const [selectedStrength, setSelectedStrength] = useState(defaultStrength);
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);

  const renderFormButtons = () => {
    return Object.keys(saltForms).map((form, index) => {
      const formStrengths = saltForms[form];
      const hasSellingPrice = Object.values(formStrengths).some((strength) => {
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
      });

      return (
        <button
          key={index}
          onClick={() => {
            setSelectedForm(form);
            const firstStrength = Object.keys(formStrengths)[0];
            setSelectedStrength(firstStrength);
            const firstPackage = Object.keys(formStrengths[firstStrength])[0];
            setSelectedPackage(firstPackage);
          }}
          className={`${selectedForm === form ? "selected" : ""} ${
            hasSellingPrice ? "available" : "not-avail"
          }`}
        >
          {form}
        </button>
      );
    });
  };

  const renderStrengthButtons = () => {
    if (selectedForm && saltForms[selectedForm]) {
      const strengthKeys = Object.keys(saltForms[selectedForm]);

      return strengthKeys.map((strength, index) => {
        const packagingKeys = Object.keys(saltForms[selectedForm][strength]);
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
            className={`${selectedStrength === strength ? "selected" : ""} ${
              hasSellingPrice ? "available" : "not-avail"
            }`}
          >
            {strength}
          </button>
        );
      });
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

      return packagingKeys.map((packaging, index) => {
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
            className={`${selectedPackage === packaging ? "selected" : ""} ${
              hasSellingPrice ? "available" : "not-avail"
            }`}
          >
            {packaging}
          </button>
        );
      });
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
          <p>
            {selectedForm} | {selectedStrength} | {selectedPackage}
          </p>
        </div>
        <div id="salt-price">{renderPrice()}</div>
      </div>
    </>
  );
}

export default SaltItem;
