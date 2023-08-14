import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const Takeabsen = () => {
  const [picture, setPicture] = useState(null);
  const [results, setResults] = useState([]);

  const webcamRef = useRef(null);

  const capture = useCallback(async () => {
    const pictureSrc = webcamRef.current.getScreenshot();
    const webpPictureBlob = await convertToWebpBlob(pictureSrc);
    setPicture(webpPictureBlob);
  }, []);

  const convertToWebpBlob = async (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, img.width, img.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/webp");
    });
  };

  const captureAndUpload = async () => {
    const pictureSrc = webcamRef.current.getScreenshot();
    const webpPictureBlob = await convertToWebpBlob(pictureSrc);

    const newResult = {
      id: results.length + 1,
      imageUrl: URL.createObjectURL(webpPictureBlob),
      description: "hasil",
    };

    setResults([...results, newResult]);
    setPicture(null);
  };

  return (
    <div>
      <h2 className="mb-5 text-center">
        Pengambilan Foto React menggunakan Webcam
      </h2>
      <div>
        {picture ? (
          <img src={URL.createObjectURL(picture)} alt="Gambar Tertangkap" />
        ) : (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        )}
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (picture) {
              setPicture(null);
            } else {
              captureAndUpload();
            }
          }}
          className={picture ? "btn btn-primary" : "btn btn-danger"}>
          {picture ? "Ambil Ulang" : "Ambil Gambar & Kirim"}
        </button>
      </div>
      <div>
        <h3>Hasil Foto</h3>
        {results.map((result) => (
          <div key={result.id}>
            <img src={result.imageUrl} alt={result.description} />
            <p>{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Takeabsen;
