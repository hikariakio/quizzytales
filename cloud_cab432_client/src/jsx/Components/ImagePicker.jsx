import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import StoryTeller from "../Tale/StoryTeller";

function ImagePicker({
  selectedImages,
  setSelectedImages,
  maxImageCount = 3,
  ready,
}) {
  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    // Check if the total number of images is less than 3 before adding them.
    if (selectedImages.length + acceptedFiles.length <= maxImageCount) {
      setSelectedImages([...selectedImages, ...acceptedFiles]);
    } else {
      alert(`You can upload a maximum of ${maxImageCount} image(s).`);
    }
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);
  };

  const normal = useDropzone({
    onDrop: onDrop,
  });

  const noNormal = useDropzone({
    onDrop: onDrop,
    noClick: true,
  });

  const clearPhotos = () => {
    setSelectedImages([]);
  };
  return (
    <div>
      <div className={"dropzone-border"}>
        {selectedImages.length === 0 ? (
          <div {...normal.getRootProps()} className={"dropzone"}>
            <input {...normal.getInputProps()} />
            <p>
              Drop your files here,
              <br />
              or click to select images.
            </p>
          </div>
        ) : (
          <div {...noNormal.getRootProps()} className="selected-images">
            <input {...noNormal.getInputProps()} />
            {selectedImages.map((file, index) => (
              <div key={index} className="selected-image">
                <div className="image-container">
                  <img src={URL.createObjectURL(file)} alt={`Image ${index}`} />
                  <div className="image-name">{file.name}</div>
                </div>
                {!ready && (
                  <button onClick={() => removeImage(index)}>x</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {!ready && (
        <div className={"manage-photobtns-container"}>
          {/*<div {...normal.getRootProps()} className="dropzone-button">*/}
          {/*  <input {...normal.getInputProps()} />*/}
          {/*  Upload Photos*/}
          {/*</div>*/}
          <button className="dropzone-button" onClick={clearPhotos}>
            Clear Photos
          </button>
          <span>
            {selectedImages.length}/{maxImageCount}
          </span>
        </div>
      )}
    </div>
  );
}

export default ImagePicker;
