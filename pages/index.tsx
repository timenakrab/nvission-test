import nvision from '@nipacloud/nvision';
import React, { useState } from 'react';
import styled from 'styled-components';

const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
`;
const ButtonSelectFile = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 180px;
  color: #c0212f;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  margin: 0px;
  border-radius: 8px;
  cursor: pointer;
  &:hover,
  &:hover i {
    color: #ffffff;
    background-color: #c0212f;
  }
  & span {
    font-family: 'Kanit';
  }
`;
const Icon = styled.i`
  font-size: 20px;
  color: #c0212f;
  margin-right: 16px;
`;
const InputFile = styled.input`
  display: none;
`;

const HomePage = () => {
  const [srcImg, setSrcImage] = useState('/preview.jpg');

  const imgToBase64 = (url: string): Promise<string> =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.toString());
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );

  const sendToML = (base64: string) => {
    const objectDetectionService = nvision.objectDetection({
      apiKey:
        'cdb29f355cb4059995e054208c89cf3a667a9ced3a5e2a047d88c5d323a6e4fbf2c99ecfd01496e729446d925d16577aac',
      streamingKey:
        'cdb29f355cb4059995e054208a8acf3c372891ed3a0f2a097c88c5d778f6e4f8a9959fcfd64093ef7f106c950b455625ac',
    });
    objectDetectionService
      .predict({
        outputCroppedImage: false,
        confidenceThreshold: 0.2,
        rawData: base64,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).files.length) {
      const preview = URL.createObjectURL((event.target as HTMLInputElement).files[0]);
      setSrcImage(preview);
      let base64: string = await imgToBase64(preview);
      base64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      sendToML(base64);
    }
  };

  return (
    <Background>
      <div>
        <img src={srcImg} width={800} height={600} alt="preview" />
        <ButtonSelectFile htmlFor="file-image">
          <Icon className="far fa-image" />
          <span>Select Image</span>
        </ButtonSelectFile>
        <InputFile
          type="file"
          name="file-image"
          id="file-image"
          accept="image/jpeg,image/x-png"
          onChange={handleSelectFile}
        />
      </div>
    </Background>
  );
};

export default HomePage;
