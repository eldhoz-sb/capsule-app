
function SaltSelect({ renderFormButtons, renderStrengthButtons, renderPackagingButtons }) {


  return (
    <div id="salt-selection">
      <div className="salt-box">
        <div className="salt-box-heading">Form:</div>
        <div className="salt-form">{renderFormButtons()}</div>
      </div>
      <div className="salt-box">
        <div className="salt-box-heading">Strength:</div>
        <div className="salt-strength">{renderStrengthButtons()}</div>
      </div>
      <div className="salt-box">
        <div className="salt-box-heading">Packaging:</div>
        <div className="salt-packaging">{renderPackagingButtons()}</div>
      </div>
    </div>
  );
}

export default SaltSelect;
