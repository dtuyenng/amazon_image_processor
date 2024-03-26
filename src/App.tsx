import React, { useState } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [labels, setLabels] = useState([]);
  const [fileContents, setFileContents] = useState([]);
  const [asin, setAsin] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).filter(
      (file) => file.type === "image/jpeg"
    );
    setFiles(selectedFiles);
    setLabels(selectedFiles.map(() => "MAIN")); // Default label is MAIN
    const promises = selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises)
      .then((results) => setFileContents(results))
      .catch((error) => console.error("Error reading files:", error));
  };

  const insertLabelBeforeExtension = (filename, label) => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return (
        filename.slice(0, lastDotIndex) +
        "_" +
        label +
        filename.slice(lastDotIndex)
      );
    } else {
      return filename + "_" + label; // If there is no extension, just append the label
    }
  };

  const handleLabelChange = (event, index) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = event.target.value;
    setLabels(updatedLabels);
  };

  const handleAsinChange = (event) => {
    setAsin(event.target.value);
  };

  const handleDownload = () => {
    if (fileContents.length > 0) {
      fileContents.forEach((content, index) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = content;
        const label = labels[index];
        const newFilename = insertLabelBeforeExtension(asin, label);
        downloadLink.download = newFilename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Amazon Image Processor</h1>
        <label htmlFor="files">Choose JPEG pictures:</label>
        <input
          id="files"
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg"
          multiple
        />
        <div>
          <label htmlFor="asin">ASIN:</label>
          <input
            id="asin"
            type="text"
            value={asin}
            onChange={handleAsinChange}
          />
        </div>
        {files.length > 0 && (
          <div>
            <p>Label for each file:</p>
            {files.map((file, index) => (
              <div key={index}>
                <img
                  src={fileContents[index]}
                  alt={`Image ${index}`}
                  style={{ maxHeight: "100px" }}
                />
                <select
                  value={labels[index]}
                  onChange={(event) => handleLabelChange(event, index)}
                >
                  <option value="MAIN">MAIN</option>
                  <option value="FRNT">FRNT</option>
                  <option value="BACK">BACK</option>
                  <option value="PT01">PT01</option>
                  <option value="PT02">PT02</option>
                  <option value="PT03">PT03</option>
                  <option value="PT04">PT04</option>
                  <option value="PT05">PT05</option>
                  <option value="PT06">PT06</option>
                </select>
              </div>
            ))}
          </div>
        )}
        {fileContents.length > 0 && (
          <button onClick={handleDownload}>Download</button>
        )}
      </header>
    </div>
  );
}

export default App;

// import { useState, FormEvent } from "react";
// import "./App.css";
// import ImageObject from "./components/ImageObject";

// function App() {
//   const [fileName, setFileName] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setFileName(file ? file.name : "");
//   };

//   const [count, setCount] = useState(0);
//   const menuItems = ["Menu 1", "Menu 2", "Menu 3", "Menu 4"];

//   const handleSubmit = (event: FormEvent) => {
//     event.preventDefault();
//     console.log("Submitted");
//   };

//   return (
//     <>
//       <input type="file" onChange={handleFileChange} />
//       {fileName && (
//         <div className="file-display">
//           <p>Selected File:</p>
//           <p>{fileName}</p>
//         </div>
//       )}
//       <div className="main_container">
//         <form className="main_form" action="post" onSubmit={handleSubmit}>
//           <input id="image_input" type="file" name="Images" multiple></input>

//           {/* <button type="submit">Upload</button> */}

//           <div className="image_container">
//             <ImageObject></ImageObject>
//             <ImageObject></ImageObject>
//             <ImageObject></ImageObject>
//             <ImageObject></ImageObject>
//             <ImageObject></ImageObject>
//             <ImageObject></ImageObject>
//           </div>

//           <div>
//             <label htmlFor="asin">ASIN</label>
//             <input id="asin" type="text" />
//           </div>

//           <button type="submit">Process Images</button>
//         </form>
//       </div>
//     </>
//   );
// }

// export default App;
