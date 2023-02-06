import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { api } from "@/helpers/config";
import { API_CUSTOMER_UPLOAD } from "@/helpers/url_helper";

const { Dragger } = Upload;

const propsUpload = {
  name: "file",
  multiple: false,
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} tải lên thành công.`);
    } else if (status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
  async customRequest(options) {
    console.log("customRequest");
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("fromFiles", file);
    try {
      const response = await fetch(
        `${api.API_URL}${API_CUSTOMER_UPLOAD}`,
        {
          method: "POST",
          headers: {
            contentType: "",
          },
          body: fmData,
        },
        config
      );
      const _res = await response;
      console.log("🚀 Upload File: ", _res);
      onSuccess("Ok");
      console.log("server res: ", _res);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  },
};
export default function DraggerUpload() {
  return (
    <Dragger {...propsUpload}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Nhấp hoặc kéo tệp vào khu vực này để tải lên
      </p>
      {/* <p className="ant-upload-hint">
        Hỗ trợ tải lên một tệp hoặc nhiều tệp cùng một lúc
      </p> */}
    </Dragger>
  );
}
