import React, { useState, useEffect } from "react";
import ReactExport from "react-export-excel";
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  SearchOutlined,
  DeleteOutlined,
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
  Tag,
  Select,
  notification,
} from "antd";
import dayjs from "dayjs";
import qs from "qs";

import DraggerUpload from "../dragger";
import axios from "axios";
import { accountAdmin789BET, api, siteName } from "@/helpers/config";
import {
  API_CHECK_INFO_INTERNAL,
  API_CUSTOMER_CHANGE_STATUS,
  API_CUSTOMER_GET_CHECK_BY_DATE,
} from "@/helpers/url_helper";
import DraggerUploadInternal from "../draggerInternal";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function Data789BetPage({ username }) {
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
  const [status, setStatus] = useState("-1");
  const [apiNoti, contextHolder] = notification.useNotification();

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
      `${api.API_URL}${API_CUSTOMER_GET_CHECK_BY_DATE}?date=${date}&siteName=${siteName}`
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
    if (values.userName || values.ip || values.fp || status) {
      const _req = {
        userName: values.userName,
        ip: values.ip,
        fp: values.fp,
        status: values.status ? values.status : status,
      };
      onSearch(_req);
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
    console.log(values);
    setLoadingTable(true);
    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_GET_CHECK_BY_DATE}?${qs.stringify(
        values
      )}&siteName=${siteName}`
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
      `${api.API_URL}${API_CHECK_INFO_INTERNAL}?${qs.stringify(
        _req
      )}&siteName=${siteName}`
    );
    setDataTableInternal(_res?.data.status !== 0 ? [_res?.data] : []);
    setLoadingTableInternal(false);
  };

  const handleChangeStatus = (value) => {
    setStatus(value);
  };

  const onChangeStatus = async (userName, status) => {
    const _req = {
      userName: userName,
      adminName: username,
      status: status,
      siteName: siteName,
    };
    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_CHANGE_STATUS}?${qs.stringify(_req)}`
    );

    if (!_res?.data?.success && _res?.data?.errorStatus === "different cskh") {
      return apiNoti["warning"]({
        message: "C???nh b??o",
        description: <Typography>B???n kh??ng c?? quy???n th???c hi???n!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 2) {
      onSearch();
      return apiNoti["success"]({
        message: "Th??nh c??ng",
        description: <Typography>Kh??a ????n th??nh c??ng!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 3) {
      onSearch();
      return apiNoti["success"]({
        message: "Th??nh c??ng",
        description: <Typography>T??? ch???i ????n th??nh c??ng!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 4) {
      onSearch();
      return apiNoti["success"]({
        message: "Th??nh c??ng",
        description: <Typography>????a v??o danh s??ch ??en th??nh c??ng!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 1) {
      onSearch();
      return apiNoti["success"]({
        message: "Th??nh c??ng",
        description: <Typography>X??? l?? ????n th??nh c??ng!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 0) {
      onSearch();
      return apiNoti["success"]({
        message: "Th??nh c??ng",
        description: <Typography>G??? kh???i danh s??ch ??en th??nh c??ng!</Typography>,
      });
    } else if (!_res?.data?.success) {
      return apiNoti["error"]({
        message: "Th???t b???i",
        description: <Typography>{_res?.data?.errorStatus}</Typography>,
      });
    }
  };

  const columns = [
    {
      title: "T??n t??i kho???n",
      dataIndex: "userName",
      key: "userName",
      render: (text) => {
        return <Typography.Paragraph copyable>{text}</Typography.Paragraph>;
      },
    },
    {
      title: "H??? v?? t??n",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "T??n ng??n h??ng",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "STK ng??n h??ng",
      dataIndex: "bankNumber",
      key: "bankNumber",
      render: (text) => {
        return "**********" + text.slice(text.length - 4, text.length);
      },
    },
    {
      title: "VIP",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "??i???m th?????ng",
      dataIndex: "bonusValue",
      key: "bonusValue",
      render: (text) => {
        return <Typography.Paragraph copyable>{text}</Typography.Paragraph>;
      },
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
    {
      title: "S??? l???n ??KNT",
      dataIndex: "checkCount",
      key: "checkCount",
    },
    {
      title: "Th???i gian ??K",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => {
        return dayjs(text).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return (
          <Tag
            color={
              text === 0
                ? "green"
                : text === 1
                ? "cyan"
                : text === 2
                ? "purple"
                : text === 3
                ? "red"
                : text === 4
                ? "black"
                : ""
            }
            key={text}
          >
            {text === 0
              ? "??ANG CH???"
              : text === 1
              ? "X??? L?? XONG"
              : text === 2
              ? "KH??A ????N"
              : text === 3
              ? "T??? CH???I"
              : text === 4
              ? "DS ??EN"
              : ""}
          </Tag>
        );
      },
    },
    {
      title: "Ng?????i x??? l??",
      dataIndex: "adminName",
      key: "adminName",
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space>
          {_.status === 0 ? (
            <>
              <Button
                size="small"
                onClick={() => onChangeStatus(_.userName, 2)}
              >
                KH??A ????N
              </Button>
              <Button
                size="small"
                onClick={() => onChangeStatus(_.userName, 4)}
              >
                ????A V??O DS ??EN
              </Button>
            </>
          ) : _.status === 2 ? (
            <>
              <Button
                size="small"
                onClick={() => onChangeStatus(_.userName, 3)}
              >
                T??? CH???I
              </Button>
              <Button
                size="small"
                onClick={() => onChangeStatus(_.userName, 1)}
              >
                X??? L?? XONG
              </Button>
            </>
          ) : _.status === 4 ? (
            <Button size="small" onClick={() => onChangeStatus(_.userName, 0)}>
              G??? DS ??EN
            </Button>
          ) : (
            ""
          )}
        </Space>
      ),
    },
  ];

  const columnsInternal = [
    {
      title: "T??n t??i kho???n",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "H??? v?? t??n",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "T??n ng??n h??ng",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "STK ng??n h??ng",
      dataIndex: "bankNumber",
      key: "bankNumber",
      render: (text) => {
        return "**********" + text.slice(text.length - 4, text.length);
      },
    },
    {
      title: "VIP",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "??i???m th?????ng",
      dataIndex: "bonusValue",
      key: "bonusValue",
    },
  ];

  return (
    <div style={{ maxWidth: "100vw", margin: "0 auto", padding: "0 10px" }}>
      {contextHolder}

      <Row>
        {username === accountAdmin789BET.username && (
          <Col xs={24} style={{ textAlign: "center" }}>
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={showModalInternalUp}
              >
                Upload file excel (N???i b??? check)
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={showModalUp}
              >
                Upload file excel (Kh??ch check)
              </Button>
              <Button
                type="primary"
                icon={<CloudDownloadOutlined />}
                onClick={showModalDown}
              >
                Export data excel (Kh??ch check)
              </Button>
            </Space>
          </Col>
        )}

        <Row style={{ width: "100%" }}>
          <Col xs={24} lg={24}>
            <Col xs={24} style={{ textAlign: "center" }}>
              <Typography.Title level={3}>D??? LI???U KH??CH</Typography.Title>
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
                  <Input placeholder="Nh???p t??n t??i kho???n" allowClear />
                </Form.Item>
                <Form.Item label="" name="status">
                  <Select
                    defaultValue="-1"
                    onChange={handleChangeStatus}
                    style={{ width: 120 }}
                    allowClear
                    options={[
                      {
                        value: "-1",
                        label: "T???t c???",
                      },
                      {
                        value: "0",
                        label: "??ang ch???",
                      },
                      {
                        value: "1",
                        label: "X??? l?? xong",
                      },
                      {
                        value: "2",
                        label: "Kh??a ????n",
                      },
                      {
                        value: "3",
                        label: "T??? ch???i",
                      },
                      {
                        value: "4",
                        label: "DS ??en",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="" name="ip">
                  <Input placeholder="Nh???p IP" allowClear />
                </Form.Item>

                <Form.Item label="" name="fp">
                  <Input placeholder="Nh???p FP" allowClear />
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
          </Col>

          <Divider />
          <Col xs={24} lg={24}>
            <Col xs={24} style={{ textAlign: "center" }}>
              <Typography.Title level={3}>D??? LI???U N???I B???</Typography.Title>
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
                  <Input placeholder="Nh???p t??n t??i kho???n" allowClear />
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
          </Col>
        </Row>

        <Modal
          title="T???i t???p l??n (Kh??ch check)"
          open={isModalUpOpen}
          onOk={handleOkUp}
          onCancel={handleCancelUp}
          footer={null}
          maskClosable={false}
        >
          <DraggerUpload />
        </Modal>

        <Modal
          title="T???i t???p l??n (N???i b??? check)"
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
                  placeholder="Ch???n ng??y"
                  style={{ width: "100%" }}
                />

                <ExcelFile
                  filename={`789bet_check_customers_info`}
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
                    name={"789bet_check_customers_info"}
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
                Kh??ng ch???n ng??y ????? t???i t???t c??? d??? li???u
              </Typography>
            </Col>
          </Row>
        </Modal>
      </Row>
    </div>
  );
}
