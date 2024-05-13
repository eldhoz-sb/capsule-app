import { useEffect, useState } from "react";
import "./SearchResults.css";

function SearchResults({ results }) {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [defaultOptions, setDefaultOptions] = useState({});
  const [showMoreForms, setShowMoreForms] = useState(false);
  const [showMoreStrengths, setShowMoreStrengths] = useState(false);
  const [showMorePackagings, setShowMorePackagings] = useState(false);

  useEffect(() => {
    if (
      results &&
      results.data &&
      results.data.saltSuggestions &&
      results.data.saltSuggestions.length > 0
    ) {
      const defaultOptionsObj = {};
      results.data.saltSuggestions.forEach((saltSuggestion) => {
        const defaultForm = saltSuggestion.available_forms[0];
        const defaultStrength = Object.keys(
          saltSuggestion.salt_forms_json[defaultForm]
        )[0];
        const defaultPacking = Object.keys(
          saltSuggestion.salt_forms_json[defaultForm][defaultStrength]
        )[0];
        defaultOptionsObj[saltSuggestion.id] = {
          selectedForm: defaultForm,
          selectedStrength: defaultStrength,
          selectedPacking: defaultPacking,
        };
      });
      setDefaultOptions(defaultOptionsObj);
    }
  }, [results]);

  useEffect(() => {
    setSelectedOptions(defaultOptions);
  }, [defaultOptions]);

  const handleFormSelect = (saltId, form) => {
    const firstStrength = Object.keys(
      results.data.saltSuggestions.find((salt) => salt.id === saltId)
        .salt_forms_json[form]
    )[0];
    const firstPacking = Object.keys(
      results.data.saltSuggestions.find((salt) => salt.id === saltId)
        .salt_forms_json[form][firstStrength]
    )[0];
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [saltId]: {
        selectedForm: form,
        selectedStrength: firstStrength,
        selectedPacking: firstPacking,
      },
    }));
  };

  const handleStrengthSelect = (saltId, strength) => {
    const firstPacking = Object.keys(
      results.data.saltSuggestions.find((salt) => salt.id === saltId)
        .salt_forms_json[selectedOptions[saltId].selectedForm][strength]
    )[0];
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [saltId]: {
        ...prevOptions[saltId],
        selectedStrength: strength,
        selectedPacking: firstPacking,
      },
    }));
  };

  const handlePackingSelect = (saltId, packing) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [saltId]: { ...prevOptions[saltId], selectedPacking: packing },
    }));
  };

  // Click handler for the "More" button for forms
  const handleShowMoreForms = () => {
    setShowMoreForms((prevShowMoreForms) => !prevShowMoreForms);
  };

  // Click handler for the "More" button for strengths
  const handleShowMoreStrengths = () => {
    setShowMoreStrengths((prevShowMoreStrengths) => !prevShowMoreStrengths);
  };

  // Click handler for the "More" button for packagings
  const handleShowMorePackagings = () => {
    setShowMorePackagings((prevShowMorePackagings) => !prevShowMorePackagings);
  };

  return (
    <section id="search-results" className="grid">
      {results && results.data && results.data.saltSuggestions ? (
        results.data.saltSuggestions.map((saltSuggestion) => (
          <div key={saltSuggestion.id} className="salt-suggestion">
            <div id="salt-selection">
              <div className="salt-box">
                <div className="salt-box-heading">Form:</div>
                <div className="salt-form">
                  {showMoreForms
                    ? saltSuggestion.available_forms.map((saltform, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleFormSelect(saltSuggestion.id, saltform)
                          }
                          className={
                            selectedOptions[saltSuggestion.id]?.selectedForm ===
                            saltform
                              ? "selected"
                              : ""
                          }
                        >
                          {saltform}
                        </button>
                      ))
                    : saltSuggestion.available_forms
                        .slice(0, 4)
                        .map((saltform, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleFormSelect(saltSuggestion.id, saltform)
                            }
                            className={
                              selectedOptions[saltSuggestion.id]
                                ?.selectedForm === saltform
                                ? "selected"
                                : ""
                            }
                          >
                            {saltform}
                          </button>
                        ))}
                  {saltSuggestion.available_forms.length > 4 && (
                    <span className="more-button" onClick={handleShowMoreForms}>
                      {showMoreForms ? "Hide" : "More"}
                    </span>
                  )}
                </div>
              </div>
              <div className="salt-box">
                <div className="salt-box-heading">Strength:</div>
                <div className="salt-strength">
                  {selectedOptions[saltSuggestion.id]?.selectedForm &&
                    Object.keys(
                      saltSuggestion.salt_forms_json[
                        selectedOptions[saltSuggestion.id]?.selectedForm
                      ]
                    ).map((strength, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleStrengthSelect(saltSuggestion.id, strength)
                        }
                        className={
                          selectedOptions[saltSuggestion.id]
                            ?.selectedStrength === strength
                            ? "selected"
                            : ""
                        }
                      >
                        {strength}
                      </button>
                    ))}
                </div>
              </div>
              <div className="salt-box">
                <div className="salt-box-heading">Packaging:</div>
                <div className="salt-packaging">
                  {selectedOptions[saltSuggestion.id]?.selectedForm &&
                    selectedOptions[saltSuggestion.id]?.selectedStrength &&
                    saltSuggestion.salt_forms_json[
                      selectedOptions[saltSuggestion.id]?.selectedForm
                    ][selectedOptions[saltSuggestion.id]?.selectedStrength] && (
                      <>
                        {Object.keys(
                          saltSuggestion.salt_forms_json[
                            selectedOptions[saltSuggestion.id]?.selectedForm
                          ][
                            selectedOptions[saltSuggestion.id]?.selectedStrength
                          ]
                        )
                          .slice(0, showMorePackagings ? undefined : 4) // Show only the first 4 packagings by default
                          .map((packing, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handlePackingSelect(saltSuggestion.id, packing)
                              }
                              className={
                                selectedOptions[saltSuggestion.id]
                                  ?.selectedPacking === packing
                                  ? "selected"
                                  : ""
                              }
                            >
                              {packing}
                            </button>
                          ))}
                        {Object.keys(
                          saltSuggestion.salt_forms_json[
                            selectedOptions[saltSuggestion.id]?.selectedForm
                          ][
                            selectedOptions[saltSuggestion.id]?.selectedStrength
                          ]
                        ).length > 4 && (
                          <span
                            className="more-button"
                            onClick={handleShowMorePackagings}
                          >
                            {showMorePackagings ? "Hide" : "More"}
                          </span>
                        )}
                      </>
                    )}
                </div>
              </div>
            </div>
            <div id="salt-main">
              <h4>{saltSuggestion.salt}</h4>
              <p>
                {selectedOptions[saltSuggestion.id]?.selectedForm} |{" "}
                {selectedOptions[saltSuggestion.id]?.selectedStrength} |{" "}
                {selectedOptions[saltSuggestion.id]?.selectedPacking}
              </p>
            </div>
            <div id="salt-price">{/* Add logic to display price here */}</div>
          </div>
        ))
      ) : (
        <span className="search-results-placeholder">
          “ Find medicines with amazing discount “
        </span>
      )}
    </section>
  );
}

export default SearchResults;
