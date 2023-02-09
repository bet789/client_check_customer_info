import React, { useState, useEffect } from "react";
import ReactExport from "react-export-excel";
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Row,
  Col,
  Modal,
  Space,
  DatePicker,
  Typography,
  Form,
  Input,
  Divider,
  Table,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import qs from "qs";

import DraggerUpload from "../dragger";
import axios from "axios";
import { accountAdmin, api } from "@/helpers/config";
import {
  API_CHECK_INFO_INTERNAL,
  API_CUSTOMER_GET_CHECK_BY_DATE,
} from "@/helpers/url_helper";
import DraggerUploadInternal from "../draggerInternal";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function DataPage({ username }) {
  const [isModalUpOpen, setIsModalUpOpen] = useState(false);
  const [isModalInternalUpOpen, setIsModalInternalUpOpen] = useState(false);
  const [isModalDownOpen, setIsModalDownOpen] = useState(false);
  const [dataSet, setDataSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs(dayjs().format("MM-DD-YYYY")));
  const [dataTable, setDataTable] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataTableInternal, setDataTableInternal] = useState([]);
  const [loadingTableInternal, setLoadingTableInternal] = useState(false);

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

  const showModalInternalUp = () => {
    setIsModalInternalUpOpen(true);
  };

  const handleOkUpInternal = () => {
    setIsModalInternalUpOpen(false);
  };

  const handleCancelUpInternal = () => {
    setIsModalInternalUpOpen(false);
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

  const onFinish = async (values) => {
    console.log("Success:", values);
    if (values.userName || values.ip || values.fp) {
      onSearch(values);
    } else {
      setDataTable([]);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinishInternal = async (values) => {
    console.log("Success:", values);
    if (values.userNameInternal) {
      onSearchInternal(values);
    } else {
      setDataTable([]);
    }
  };
  const onFinishFailedInternal = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onSearch = async (values) => {
    setLoadingTable(true);
    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_GET_CHECK_BY_DATE}?${qs.stringify(values)}`
    );

    setDataTable(_res?.data?.data || []);
    setLoadingTable(false);
  };

  const onSearchInternal = async (values) => {
    setLoadingTableInternal(true);
    const _req = {
      userName: values.userNameInternal,
    };
    const _res = await axios.post(
      `${api.API_URL}${API_CHECK_INFO_INTERNAL}?${qs.stringify(_req)}`
    );
    setDataTableInternal([_res?.data] || []);
    setLoadingTableInternal(false);
  };

  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tên ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "STK ngân hàng",
      dataIndex: "bankNumber",
      key: "bankNumber",
      render: (text) => {
        const tstart = text.charAt(text.length - 5);
        return "**********" + text.slice(tstart);
      },
    },
    {
      title: "VIP",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Điểm thưởng",
      dataIndex: "bonusValue",
      key: "bonusValue",
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "FP",
      dataIndex: "fp",
      key: "fp",
    },
  ];

  const columnsInternal = [
    {
      title: "Tên tài khoản",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tên ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "STK ngân hàng",
      dataIndex: "bankNumber",
      render: (text) => {
        const tstart = text.charAt(text.length - 5);
        return "**********" + text.slice(tstart);
      },
      key: "bankNumber",
    },
    {
      title: "VIP",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Điểm thưởng",
      dataIndex: "bonusValue",
      key: "bonusValue",
    },
  ];

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto" }}>
      <Row>
        {username === accountAdmin.username && (
          <Col xs={24} style={{ textAlign: "center" }}>
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={showModalInternalUp}
              >
                Upload file excel (Nội bộ check)
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={showModalUp}
              >
                Upload file excel (Khách check)
              </Button>
              <Button
                type="primary"
                icon={<CloudDownloadOutlined />}
                onClick={showModalDown}
              >
                Export data excel (Khách check)
              </Button>
            </Space>
          </Col>
        )}

        <Col xs={24} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>DỮ LIỆU KHÁCH</Typography.Title>
        </Col>
        <Col
          xs={24}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Form
            name="form-check"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="inline"
          >
            <Form.Item label="" name="userName">
              <Input placeholder="Nhập tên tài khoản" allowClear />
            </Form.Item>

            <Form.Item label="" name="ip">
              <Input placeholder="Nhập IP" allowClear />
            </Form.Item>

            <Form.Item label="" name="fp">
              <Input placeholder="Nhập FP" allowClear />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loadingTable}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          xs={24}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Table
            rowKey={(i) => i.userName}
            columns={columns}
            dataSource={dataTable}
            loading={loadingTable}
          />
        </Col>
        <Divider />

        <Col xs={24} style={{ textAlign: "center" }}>
          <Typography.Title level={3}>DỮ LIỆU NỘI BỘ</Typography.Title>
        </Col>
        <Col
          xs={24}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Form
            name="form-check-internal"
            onFinish={onFinishInternal}
            onFinishFailed={onFinishFailedInternal}
            autoComplete="off"
            layout="inline"
          >
            <Form.Item label="" name="userNameInternal">
              <Input placeholder="Nhập tên tài khoản" allowClear />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loadingTableInternal}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          xs={24}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Table
            rowKey={(i) => i.userName}
            columns={columnsInternal}
            dataSource={dataTableInternal}
            loading={loadingTableInternal}
          />
        </Col>

        <Modal
          title="Tải tệp lên (Khách check)"
          open={isModalUpOpen}
          onOk={handleOkUp}
          onCancel={handleCancelUp}
          footer={null}
          maskClosable={false}
        >
          <DraggerUpload />
        </Modal>

        <Modal
          title="Tải tệp lên (Nội bộ check)"
          open={isModalInternalUpOpen}
          onOk={handleOkUpInternal}
          onCancel={handleCancelUpInternal}
          footer={null}
          maskClosable={false}
        >
          <DraggerUploadInternal />
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
