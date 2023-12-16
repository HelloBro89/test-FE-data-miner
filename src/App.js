import React, { useState } from 'react';
import axios from 'axios';

const MOCK_USER_ID = '111';

const App = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [fileFields, setFileFields] = useState([]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFileChange = (event, index) => {
    const updatedFileFields = [...fileFields];
    updatedFileFields[index].files = event.target.files;
    setFileFields(updatedFileFields);
  };

  const handleAddField = () => {
    setFileFields([...fileFields, { title: selectedOption, files: null }]);
  };

  const handleUploadAll = () => {
    const userData = [];
    const formData = new FormData();
    fileFields.forEach((field, ind) => {
      if (field.files) {
        for (let i = 0; i < field.files.length; i++) {
          userData.push({ scraperType: field.title, userId: MOCK_USER_ID, fileInd: `${ind}` });
          formData.append(`${ind}`, field.files[i]);
        }
      }
    });
    formData.append('userData', JSON.stringify(userData));
    axios.post('http://localhost:4000/customer/scrape', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const handleRemoveField = (index) => {
    const updatedFileFields = [...fileFields];
    updatedFileFields.splice(index, 1);
    setFileFields(updatedFileFields);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div>
        <label>
          <input
            type="radio"
            value="PDP"
            checked={selectedOption === 'PDP'}
            onChange={handleOptionChange}
          />
          PDP
        </label>
        <label>
          <input
            type="radio"
            value="LISTING"
            checked={selectedOption === 'LISTING'}
            onChange={handleOptionChange}
          />
          LISTING
        </label>
      </div>
      {fileFields.map((field, index) => (
        <div
          key={index}
          style={{
            textAlign: 'center',
            margin: '10px',
            marginTop: '40px',
          }}
        >
          <div>{field.title}</div>
          <input
            style={{
              marginTop: '10px',
            }}
            type="file"
            onChange={(event) => handleFileChange(event, index)}
          />
          <button onClick={() => handleRemoveField(index)}>Remove</button>
        </div>
      ))}
      <button
        style={{
          marginTop: '30px',
          width: '200px',
          height: '30px',
        }}
        onClick={handleAddField}
      >
        Add Field
      </button>
      <button
        style={{
          marginTop: '30px',
          width: '200px',
          height: '30px',
        }}
        onClick={handleUploadAll}
      >
        Upload All
      </button>
    </div>
  );
};

export default App;
