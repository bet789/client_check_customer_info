"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  InputNumber,
  Select,
  notification,
  Typography,
  Avatar,
  Modal,
} from "antd";
import dynamic from "next/dynamic";
import axios from "axios";
import qs from "qs";

const ClientJs = dynamic(() => import("../ClientJs"), {
  ssr: false,
});

import { api } from "@/helpers/config";
import {
  API_CHECK_CUSTOMER_INFO,
  API_CUSTOMER_LISTBANK,
} from "@/helpers/url_helper";

import logo from "@/assets/images/logo.png";
import vip1 from "@/assets/images/icon_vip/vip1.png";
import vip2 from "@/assets/images/icon_vip/vip2.png";
import vip3 from "@/assets/images/icon_vip/vip3.png";
import vip4 from "@/assets/images/icon_vip/vip4.png";
import vip5 from "@/assets/images/icon_vip/vip5.png";
import vip6 from "@/assets/images/icon_vip/vip6.png";
import vip7 from "@/assets/images/icon_vip/vip7.png";
import vip8 from "@/assets/images/icon_vip/vip8.png";
import vip9 from "@/assets/images/icon_vip/vip9.png";
import vip10 from "@/assets/images/icon_vip/vip10.png";
import vip11 from "@/assets/images/icon_vip/vip11.png";
import vip12 from "@/assets/images/icon_vip/vip12.png";
import vip13 from "@/assets/images/icon_vip/vip13.png";
import vip14 from "@/assets/images/icon_vip/vip14.png";
import vip15 from "@/assets/images/icon_vip/vip15.png";
import vip16 from "@/assets/images/icon_vip/vip16.png";
import vip17 from "@/assets/images/icon_vip/vip17.png";
import vip18 from "@/assets/images/icon_vip/vip18.png";
import vip19 from "@/assets/images/icon_vip/vip19.png";
import vip20 from "@/assets/images/icon_vip/vip20.png";

export default function SHBET() {
  const [form] = Form.useForm();
  const [fingerPrint, setFingerPrint] = useState();
  const [loading, setLoading] = useState(false);
  const [apiNoti, contextHolder] = notification.useNotification();
  const [listBank, setListBank] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ip, setIP] = useState("");

  useEffect(() => {
    getListBank();
    getIP();
  }, []);

  const getIP = async () => {
    const res = await axios.get(
      "https://pro.ip-api.com/json?key=RtTkFLx75rt81E5"
    );
    setIP(res?.data?.query);
  };

  const getListBank = async () => {
    await axios
      .get(`${api.API_URL}${API_CUSTOMER_LISTBANK}`)
      .then((response) => {
        const _listBank = response?.data.map((item, index) => {
          return { value: item, label: item };
        });
        setListBank(_listBank || []);
      });
  };

  const onFinish = async (values) => {
    console.log("Success:", values);

    if (fingerPrint) {
      setLoading(true);
      const data = {
        userName: values.userName.toString().trim(),
        fullName: values.fullName,
        bankNum: values.bankNum,
        bankName: values.bankName,
        fp: fingerPrint,
        ip: ip,
      };

      await axios
        .post(`${api.API_URL}${API_CHECK_CUSTOMER_INFO}?${qs.stringify(data)}`)
        .then(function (response) {
          if (response?.data?.status === 0) {
            setLoading(false);
            apiNoti["error"]({
              message: "Th???t b???i",
              placement: "center",
              description: <Typography>T??i kho???n kh??ng t???n t???i!</Typography>,
            });
          } else if (response?.data?.status === 2) {
            setLoading(false);
            apiNoti["error"]({
              message: "Th???t b???i",
              placement: "center",
              description: <Typography>Sai h??? v?? t??n!</Typography>,
            });
          } else if (response?.data?.status === 3) {
            setLoading(false);
            apiNoti["error"]({
              message: "Th???t b???i",
              placement: "center",
              description: <Typography>Sai t??n ng??n h??ng!</Typography>,
            });
          } else if (response?.data?.status === 4) {
            setLoading(false);
            apiNoti["error"]({
              message: "Th???t b???i",
              placement: "center",
              description: <Typography>Sai s??? t??i kho???n ng??n h??ng!</Typography>,
            });
          } else {
            setLoading(false);
            apiNoti["success"]({
              duration: 5000,
              message: "Th??nh c??ng",
              placement: "center",
              description: (
                <>
                  <Typography>T??i kho???n: {response?.data?.userName}</Typography>
                  <Typography>
                    C???p VIP: {handleImgVIP(response?.data?.level)}
                    {response?.data?.level}
                  </Typography>
                  <Typography>
                    Th?????ng mi???n ph??: {response?.data?.bonusValue} ??i???m - H???t h???n
                    sau: 30/03/2023
                  </Typography>
                  <Typography>
                    <a
                      href="https://live.shbet.win/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Li??n h??? nh???n th?????ng
                    </a>
                  </Typography>
                  <Typography>B???n c???n ho??n th??nh ??i???u ki???n sau:</Typography>
                  <Typography>
                    S??? ti???n n???p:
                    <span style={{ color: "#f01" }}>
                      {` ${(parseInt(response?.data?.bonusValue) * 30) / 100} `}
                    </span>{" "}
                    ??i???m
                  </Typography>
                  <Typography>
                    S??? l???n n???p: <span style={{ color: "#f01" }}>3</span> l???n tr???
                    l??n
                  </Typography>
                </>
              ),
            });
          }
        })
        .catch((error) => {
          console.log("error: " + error);
          setLoading(false);
          apiNoti["error"]({
            message: "Th???t b???i",
            description: error,
            placement: "center",
          });
        });
    }
  };

  const handleImgVIP = (level) => {
    level = level?.toString().slice(3).trim();
    switch (level) {
      case "1":
        return <Avatar src={vip1.src} />;
        break;
      case "2":
        return <Avatar src={vip2.src} />;
        break;
      case "3":
        return <Avatar src={vip3.src} />;
        break;
      case "4":
        return <Avatar src={vip4.src} />;
        break;
      case "5":
        return <Avatar src={vip5.src} />;
        break;
      case "6":
        return <Avatar src={vip6.src} />;
        break;
      case "7":
        return <Avatar src={vip7.src} />;
        break;
      case "8":
        return <Avatar src={vip8.src} />;
        break;
      case "9":
        return <Avatar src={vip9.src} />;
        break;
      case "10":
        return <Avatar src={vip10.src} />;
        break;
      case "11":
        return <Avatar src={vip11.src} />;
        break;
      case "12":
        return <Avatar src={vip12.src} />;
        break;
      case "13":
        return <Avatar src={vip13.src} />;
        break;
      case "14":
        return <Avatar src={vip14.src} />;
        break;
      case "15":
        return <Avatar src={vip15.src} />;
        break;
      case "16":
        return <Avatar src={vip16.src} />;
        break;
      case "17":
        return <Avatar src={vip17.src} />;
        break;
      case "18":
        return <Avatar src={vip18.src} />;
        break;
      case "19":
        return <Avatar src={vip19.src} />;
        break;
      case "20":
        return <Avatar src={vip20.src} />;
        break;
      default:
        break;
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    // apiNoti["error"]({
    //   duration: 500000,
    //   message: "Th???t b???i",
    //   description: <Typography>Sai s??? t??i kho???n ng??n h??ng!</Typography>,
    //   placement: "center",
    // });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="wrapper">
      {contextHolder}
      <ClientJs setFingerPrint={setFingerPrint} />
      <div className="container">
        <Form
          form={form}
          name="form-check-customer-info"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={[4, 4]} className="box-check-customer-info">
            <Col xs={24} className="text-center">
              <Image src={logo} alt="shbet" />
            </Col>
            <Col xs={24}>
              <Form.Item
                label="T??i kho???n"
                name="userName"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p t??i kho???n!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="H??? v?? t??n"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p h??? v?? t??n!",
                  },
                  {
                    pattern: new RegExp(/^[A-Z\s]+$/u),
                    message: "Vui l??ng vi???t hoa kh??ng d???u!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="T??n ng??n h??ng"
                name="bankName"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng ch???n ng??n h??ng!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  placeholder="Ch???n ng??n h??ng"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    )
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={listBank}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="STK ng??n h??ng (4 s??? cu???i)"
                name="bankNum"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p 4 s??? cu???i t??i kho???n ng??n h??ng!",
                  },
                  {
                    pattern: new RegExp(/^[\d]{0,4}$/),
                    message:
                      "Vui l??ng nh???p ????ng 4 s??? cu???i t??i kho???n ng??n h??ng!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} className="text-center policy">
              <Typography.Link italic onClick={showModal}>
                ??i???u kho???n v?? ch??nh s??ch
              </Typography.Link>
              <Modal
                title="VI???T KI???U H???I H????NG"
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
                width={700}
                style={{ top: 20 }}
              >
                <p>
                  <b>??? M??: </b>
                  <span style={{ color: "#f01" }}>
                    <b>VIPSHBET</b>
                  </span>
                </p>
                <p>
                  <b>??? Th???i gian b???t ?????u:</b> 00:00:00 08/02/2023 (Gi??? h??? th???ng)
                </p>
                <p>
                  <b>??? Th???i gian k???t th??c:</b> 23:59:59 02/03/2023 (Gi??? h???
                  th???ng)
                </p>
                <p>
                  <b>??? CH?? ??:</b> 1 ??i???m = 1,000 VND
                </p>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#2f7899",
                  }}
                >
                  SHBET.COM
                </p>

                <p>
                  <b>??? N???i dung s??? ki???n:</b>T???t c??? th??nh vi??n ???? t???ng tham gia
                  t???i SHBET ?????t t??? c???p{" "}
                  <span style={{ color: "#f01" }}>VIP 1 </span>
                  tr??? l??n khi tr??? l???i tham gia t???i SHBET s??? nh???n ???????c ph???n
                  th?????ng mi???n ph?? t????ng ???ng t???i ??a l??n ?????n
                  <span style={{ color: "#f01" }}> 888,800,000 VND</span>. Chi
                  ti???t nh?? sau:
                </p>

                <table>
                  <thead>
                    <tr>
                      <th>C???p VIP</th>
                      <th>Th?????ng mi???n ph??</th>
                      <th>V??ng C?????c</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>25</td>
                      <td rowSpan={20}>1 V??ng</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>40</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>80</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>160</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>480 </td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>1,580 </td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>2,080 </td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>3,880 </td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>6,800 </td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>9,800 </td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td>15,800 </td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td>20,800 </td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td>28,800 </td>
                    </tr>
                    <tr>
                      <td>14</td>
                      <td>36,800 </td>
                    </tr>
                    <tr>
                      <td>15</td>
                      <td>58,880 </td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td>128,800</td>
                    </tr>
                    <tr>
                      <td>17</td>
                      <td>158,800 </td>
                    </tr>
                    <tr>
                      <td>18</td>
                      <td>388,800 </td>
                    </tr>
                    <tr>
                      <td>19</td>
                      <td>588,800 </td>
                    </tr>
                    <tr>
                      <td>20</td>
                      <td>888,800 </td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  <b>??? ??i???u ki???n nh???n th?????ng:</b> (t??nh t??? ng??y 08/02/2023 tr???
                  v??? sau)
                </p>
                <p> - C?? t??? 3 l???n n???p ti???n tr??? l??n.</p>
                <p> - S??? ti???n n???p ph???i ?????t 30% ti???n th?????ng.</p>
                <p>
                  - T??i kho???n t??? ng??y 14/01/2023 tr??? v??? sau c?? thay ?????i th??ng
                  tin ng??n h??ng kh??ng ???????c tham gia ch????ng tr??nh n??y.
                </p>
                <p>
                  <b>??? V?? d???: </b>Th??nh vi??n c?? VIP 6 nh???n th?????ng mi???n ph?? l??
                  1,580 ??i???m (ti???n n???p: 1,580 * 30% = 474 ??i???m), th??nh vi??n c??
                  ti???n n???p t??? 474 ??i???m tr??? l??n s??? nh???n ???????c ph???n th?????ng VIP
                  t????ng ???ng.
                </p>
                <p>
                  <b>L???i ng???: </b>????? ch??n th??nh c???m ??n to??n b??? h???i vi??n ???? tin
                  t?????ng th????ng hi???u SHBET, khi ??? h??? th???ng c?? b???n ??ang l?? th??nh
                  vi??n VIP SHBET chuy???n sang h??? th???ng m???i ch??ng t??i v???n b???o l??u
                  c???p VIP c???a b???n cho ?????n khi ho??n th??nh n??ng c???p h??? th???ng VIP
                  m???i, ?????ng th???i t???ng mi???n ph?? ph???n th?????ng VIP khi tham gia tr??n
                  h??? th???ng m???i. B???n h??y nh???p ?????y ????? v?? ch??nh x??c th??ng tin ?????
                  bi???t ch??nh x??c v??{" "}
                  <a
                    href="https://live.shbet.win/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    li??n h??? ch??m s??c kh??ch h??ng
                  </a>{" "}
                  ????ng k?? nh???n th?????ng.
                </p>
              </Modal>
            </Col>

            <Col xs={24} className="text-center">
              <Form.Item>
                <Button
                  className="btn-shbet"
                  htmlType="submit"
                  loading={loading}
                >
                  KI???M TRA NGAY
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
