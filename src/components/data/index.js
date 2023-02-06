import React, { useState, useEffect } from "react";
import ReactExport from "react-export-excel";
import { CloudUploadOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { Button, Row, Col, Modal, Space, DatePicker, Typography } from "antd";
import dayjs from "dayjs";

import DraggerUpload from "../dragger";
import axios from "axios";
import { api } from "@/helpers/config";
import { API_CUSTOMER_GET_CHECK_BY_DATE } from "@/helpers/url_helper";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function DataPage() {
  const [isModalUpOpen, setIsModalUpOpen] = useState(false);
  const [isModalDownOpen, setIsModalDownOpen] = useState(false);
  const [dataSet, setDataSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs(dayjs().format("MM-DD-YYYY")));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const _dataSet = await getDataByDate();
      setDataSet(_dataSet);
      setLoading(false);
    };
    fetchData();
  }, [date]);

  const getDataByDate = async () => {
    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_GET_CHECK_BY_DATE}?date=${date}`
    );

    const dt = _res?.data?.data;
    var obj = {};
    obj.date = date;
    obj.data = [];

    for (let i = 0; i < dt?.length; i++) {
      var objData = {};
      objData.userName = dt[i].userName;
      objData.fullName = dt[i].fullName;
      objData.bankName = dt[i].bankName;
      objData.bankNumber = dt[i].bankNumber;
      objData.bonusValue = dt[i].bonusValue;
      objData.level = dt[i].level;
      objData.ip = dt[i].ip;
      objData.fp = dt[i].fp;

      obj.data.push(objData);
    }
    return obj;
  };

  const showModalUp = () => {
    setIsModalUpOpen(true);
  };

  const handleOkUp = () => {
    setIsModalUpOpen(false);
  };

  const handleCancelUp = () => {
    setIsModalUpOpen(false);
  };

  const showModalDown = () => {
    setIsModalDownOpen(true);
  };

  const handleOkDown = () => {
    setIsModalDownOpen(false);
  };

  const handleCancelDown = () => {
    setIsModalDownOpen(false);
  };

  const onChangeDatePicker = async (date, dateString) => {
    if (!dateString) setDate("");
    else setDate(dayjs(date).format("MM-DD-YYYY"));
  };

  const dataSet1 = [
    {
      name: "Johson",
      amount: 30000,
      sex: "M",
      is_married: true,
    },
    {
      name: "Monika",
      amount: 355000,
      sex: "F",
      is_married: false,
    },
    {
      name: "John",
      amount: 250000,
      sex: "M",
      is_married: false,
    },
    {
      name: "Josef",
      amount: 450500,
      sex: "M",
      is_married: true,
    },
  ];

  return (
    <div>
      <Row>
        <Col xs={24} style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={showModalUp}
            >
              Upload file excel
            </Button>
            <Button
              type="primary"
              icon={<CloudDownloadOutlined />}
              onClick={showModalDown}
            >
              Export data excel
            </Button>
          </Space>
        </Col>

        <Modal
          title="Tải tệp lên"
          open={isModalUpOpen}
          onOk={handleOkUp}
          onCancel={handleCancelUp}
          footer={null}
          maskClosable={false}
        >
          <DraggerUpload />
        </Modal>

        <Modal
          title="Download data"
          open={isModalDownOpen}
          onOk={handleOkDown}
          onCancel={handleCancelDown}
          footer={null}
          maskClosable={false}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Space>
                <DatePicker
                  onChange={onChangeDatePicker}
                  defaultValue={dayjs(dayjs(), "DD/MM/YYYY")}
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày"
                  style={{ width: "100%" }}
                />

                <ExcelFile
                  filename={`shbet_check_customers_info`}
                  element={
                    <Button
                      type="primary"
                      icon={<CloudDownloadOutlined />}
                      loading={loading ? true : false}
                    >
                      Download data
                    </Button>
                  }
                >
                  <ExcelSheet
                    data={dataSet?.data}
                    name={"shbet_check_customers_info"}
                  >
                    <ExcelColumn label="userName" value="userName" />
                    <ExcelColumn label="fullName" value="fullName" />
                    <ExcelColumn label="bankName" value="bankName" />
                    <ExcelColumn label="bankNumber" value="bankNumber" />
                    <ExcelColumn label="bonusValue" value="bonusValue" />
                    <ExcelColumn label="level" value="level" />
                    <ExcelColumn label="ip" value="ip" />
                    <ExcelColumn label="fp" value="fp" />
                  </ExcelSheet>
                </ExcelFile>
              </Space>
            </Col>
            <Col>
              <Typography xs={24}>
                Không chọn ngày để tải tất cả dữ liệu
              </Typography>
            </Col>
          </Row>
        </Modal>
      </Row>
    </div>
  );
}
