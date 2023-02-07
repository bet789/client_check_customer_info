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

const ClientJs = dynamic(() => import("../components/ClientJs"), {
  ssr: false,
});

import { api } from "../helpers/config";
import {
  API_CHECK_CUSTOMER_INFO,
  API_CUSTOMER_LISTBANK,
} from "@/helpers/url_helper";

import logo from "../assets/images/logo.png";
import vip1 from "../assets/images/icon_vip/vip1.png";
import vip2 from "../assets/images/icon_vip/vip2.png";
import vip3 from "../assets/images/icon_vip/vip3.png";
import vip4 from "../assets/images/icon_vip/vip4.png";
import vip5 from "../assets/images/icon_vip/vip5.png";
import vip6 from "../assets/images/icon_vip/vip6.png";
import vip7 from "../assets/images/icon_vip/vip7.png";
import vip8 from "../assets/images/icon_vip/vip8.png";
import vip9 from "../assets/images/icon_vip/vip9.png";
import vip10 from "../assets/images/icon_vip/vip10.png";
import vip11 from "../assets/images/icon_vip/vip11.png";
import vip12 from "../assets/images/icon_vip/vip12.png";
import vip13 from "../assets/images/icon_vip/vip13.png";
import vip14 from "../assets/images/icon_vip/vip14.png";
import vip15 from "../assets/images/icon_vip/vip15.png";
import vip16 from "../assets/images/icon_vip/vip16.png";
import vip17 from "../assets/images/icon_vip/vip17.png";
import vip18 from "../assets/images/icon_vip/vip18.png";
import vip19 from "../assets/images/icon_vip/vip19.png";
import vip20 from "../assets/images/icon_vip/vip20.png";

export default function Home() {
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
    const res = await axios.get("http://ip-api.com/json");
    setIP(res.data.query);
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
              message: "Thất bại",
              placement: "center",
              description: <Typography>Tài khoản không tồn tại!</Typography>,
            });
          } else if (response?.data?.status === 2) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              placement: "center",
              description: <Typography>Sai họ và tên!</Typography>,
            });
          } else if (response?.data?.status === 3) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              placement: "center",
              description: <Typography>Sai tên ngân hàng!</Typography>,
            });
          } else if (response?.data?.status === 4) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              placement: "center",
              description: <Typography>Sai số tài khoản ngân hàng!</Typography>,
            });
          } else {
            setLoading(false);
            apiNoti["success"]({
              duration: 5000,
              message: "Thành công",
              placement: "center",
              description: (
                <>
                  <Typography>Tài khoản: {response?.data?.userName}</Typography>
                  <Typography>
                    Cấp VIP: {handleImgVIP(response?.data?.level)}
                    {response?.data?.level}
                  </Typography>
                  <Typography>
                    Thưởng miễn phí: {response?.data?.bonusValue} điểm - Hết hạn
                    sau: 30/03/2023
                  </Typography>
                  <Typography>
                    <a
                      href="https://live.shbet.win/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Liên hệ nhận thưởng
                    </a>
                  </Typography>
                  <Typography>Bạn cần hoàn thành điều kiện sau:</Typography>
                  <Typography>
                    Số tiền nạp:
                    <span style={{ color: "#f01" }}>
                      {` ${(parseInt(response?.data?.bonusValue) * 30) / 100} `}
                    </span>{" "}
                    điểm
                  </Typography>
                  <Typography>
                    Số lần nạp: <span style={{ color: "#f01" }}>3</span> lần trở
                    lên
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
            message: "Thất bại",
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
    //   message: "Thất bại",
    //   description: <Typography>Sai số tài khoản ngân hàng!</Typography>,
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
                label="Tài khoản"
                name="userName"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tài khoản!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên!",
                  },
                  {
                    pattern: new RegExp(/^[A-Z\s]+$/u),
                    message: "Vui lòng viết hoa không dấu!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Tên ngân hàng"
                name="bankName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngân hàng!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  placeholder="Chọn ngân hàng"
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
                label="STK ngân hàng (4 số cuối)"
                name="bankNum"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập 4 số cuối tài khoản ngân hàng!",
                  },
                  {
                    pattern: new RegExp(/^[\d]{0,4}$/),
                    message:
                      "Vui lòng nhập đúng 4 số cuối tài khoản ngân hàng!",
                  },
                ]}
              >
                <InputNumber controls={false} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} className="text-center policy">
              <Typography.Link italic onClick={showModal}>
                Điều khoản và chính sách
              </Typography.Link>
              <Modal
                title="VIỆT KIỀU HỒI HƯƠNG"
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
                width={700}
                style={{ top: 20 }}
              >
                <p>
                  <b>※ Mã: </b>
                  <span style={{ color: "#f01" }}>
                    <b>VIPSHET</b>
                  </span>
                </p>
                <p>
                  <b>※ Thời gian bắt đầu:</b> 00:00:00 08/02/2023 (Giờ hệ thống)
                </p>
                <p>
                  <b>※ Thời gian kết thúc:</b> Cho đến khi có thông báo chính
                  thức.
                </p>
                <p>
                  <b>※ CHÚ Ý:</b> 1 điểm = 1,000 VND
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
                  <b>※ Nội dung sự kiện:</b> Tất thành đã từng tham gia tại
                  SHBET đạt từ cấp <span style={{ color: "#f01" }}>VIP 1 </span>
                  trở lên khi trở lại tham gia tại SHBET sẽ nhận được phần
                  thưởng miễn phí tương ứng tối đa lên đến
                  <span style={{ color: "#f01" }}> 888,800,000 VND</span>. Chi
                  tiết như sau:
                </p>

                <table>
                  <thead>
                    <tr>
                      <th>Cấp VIP</th>
                      <th>Thưởng miễn phí</th>
                      <th>Vòng Cược</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>25</td>
                      <td rowSpan={20}>1 Vòng</td>
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
                  <b>※ Điều kiện nhận thưởng:</b> (tính từ ngày 08/02/2023 trở
                  về sau)
                </p>
                <p> - Có từ 3 lần nạp tiền trở lên.</p>
                <p> - Số tiền nạp phải đạt 30% tiền thưởng.</p>
                <p>
                  - Tài khoản từ ngày 14/01/2023 trở về sau có thay đổi thông
                  tin ngân hàng không được tham gia chương trình ngày.
                </p>
                <p>
                  <b>※ Ví dụ: </b>Thành viên có VIP 6 nhận thưởng miễn phí là
                  1,580 điểm (tiền nạp: 1,580 * 30% = 474 điểm), thành viên có
                  tiền nạp từ 474 điểm trở lên sẽ nhận được phần thưởng VIP
                  tương ứng.
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
                  KIỂM TRA NGAY
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
