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
  const [status, setStatus] = useState("0");
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
    console.log(values);
    setLoadingTable(true);
    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_GET_CHECK_BY_DATE}?${qs.stringify(
        values
      )}&status=${status ? status : ""}&siteName=${siteName}`
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
        message: "Cảnh báo",
        description: <Typography>Bạn không có quyền thực hiện!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 2) {
      onSearch();
      return apiNoti["success"]({
        message: "Thành công",
        description: <Typography>Khóa đơn thành công!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 3) {
      onSearch();
      return apiNoti["success"]({
        message: "Thành công",
        description: <Typography>Từ chối đơn thành công!</Typography>,
      });
    } else if (_res?.data?.success && _res?.data?.status === 1) {
      onSearch();
      return apiNoti["success"]({
        message: "Thành công",
        description: <Typography>Xử lý đơn thành công!</Typography>,
      });
    } else if (!_res?.data?.success) {
      return apiNoti["error"]({
        message: "Thất bại",
        description: <Typography>{_res?.data?.errorStatus}</Typography>,
      });
    }
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
    {
      title: "Trạng thái",
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
                : ""
            }
            key={text}
          >
            {text === 0
              ? "ĐANG CHỜ"
              : text === 1
              ? "XỬ LÝ XONG"
              : text === 2
              ? "KHÓA ĐƠN"
              : text === 3
              ? "TỪ CHỐI"
              : ""}
          </Tag>
        );
      },
    },
    {
      title: "CSKH",
      dataIndex: "adminName",
      key: "adminName",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space>
          {_.status === 0 ? (
            <Button size="small" onClick={() => onChangeStatus(_.userName, 2)}>
              KHÓA ĐƠN
            </Button>
          ) : _.status === 2 ? (
            <>
              <Button
                size="small"
                onClick={() => onChangeStatus(_.userName, 3)}
              >
                TỪ CHỐI
              </Button>
              <Button
                size="small"
                onClick={() => onChangeStatus(_.userName, 1)}
              >
                XỬ LÝ XONG
              </Button>
            </>
          ) : (
            ""
          )}
        </Space>
      ),
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

        <Row style={{ width: "100%" }}>
          <Col xs={24} lg={24}>
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
                <Form.Item label="" name="status">
                  <Select
                    defaultValue="0"
                    onChange={handleChangeStatus}
                    style={{ width: 120 }}
                    allowClear
                    options={[
                      {
                        value: "0",
                        label: "Đang chờ",
                      },
                      {
                        value: "1",
                        label: "Xử lý xong",
                      },
                      {
                        value: "2",
                        label: "Khóa đơn",
                      },
                      {
                        value: "3",
                        label: "Từ chối",
                      },
                    ]}
                  />
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
          </Col>

          <Divider />
          <Col xs={24} lg={24}>
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
          </Col>
        </Row>

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
                Không chọn ngày để tải tất cả dữ liệu
              </Typography>
            </Col>
          </Row>
        </Modal>
      </Row>
    </div>
  );
}
