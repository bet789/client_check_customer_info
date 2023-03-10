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
  Space,
} from "antd";
import dynamic from "next/dynamic";
import axios from "axios";
import qs from "qs";
import dayjs from "dayjs";

const ClientJs = dynamic(() => import("../ClientJs"), {
  ssr: false,
});

import { api, siteName } from "@/helpers/config";
import {
  API_CHECK_CUSTOMER_INFO,
  API_CUSTOMER_CHANGE_STATUS_HISTORY,
  API_CUSTOMER_LISTBANK,
  API_CUSTOMER_REGISTER,
} from "@/helpers/url_helper";

import logo from "@/assets/images/logo789bet.png";
import vip1 from "@/assets/images/icon_vip_789bet/vip1.png";
import vip2 from "@/assets/images/icon_vip_789bet/vip2.png";
import vip3 from "@/assets/images/icon_vip_789bet/vip3.png";
import vip4 from "@/assets/images/icon_vip_789bet/vip4.png";
import vip5 from "@/assets/images/icon_vip_789bet/vip5.png";
import vip6 from "@/assets/images/icon_vip_789bet/vip6.png";
import vip7 from "@/assets/images/icon_vip_789bet/vip7.png";
import vip8 from "@/assets/images/icon_vip_789bet/vip8.png";
import vip9 from "@/assets/images/icon_vip_789bet/vip9.png";
import vip10 from "@/assets/images/icon_vip_789bet/vip10.png";
import vip11 from "@/assets/images/icon_vip_789bet/vip11.png";
import vip12 from "@/assets/images/icon_vip_789bet/vip12.png";
import vip13 from "@/assets/images/icon_vip_789bet/vip13.png";
import vip14 from "@/assets/images/icon_vip_789bet/vip14.png";
import vip15 from "@/assets/images/icon_vip_789bet/vip15.png";
import vip16 from "@/assets/images/icon_vip_789bet/vip16.png";
import vip17 from "@/assets/images/icon_vip_789bet/vip17.png";
import vip18 from "@/assets/images/icon_vip_789bet/vip18.png";
import vip19 from "@/assets/images/icon_vip_789bet/vip19.png";
import vip20 from "@/assets/images/icon_vip_789bet/vip20.png";

export default function BET789() {
  const [form] = Form.useForm();
  const [fingerPrint, setFingerPrint] = useState();
  const [loading, setLoading] = useState(false);
  const [apiNoti, contextHolder] = notification.useNotification();
  const [listBank, setListBank] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [ip, setIP] = useState("");
  const [dataHistory, setDataHistory] = useState([]);

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
      .get(`${api.API_URL}${API_CUSTOMER_LISTBANK}?siteName=${siteName}`)
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
        siteName: siteName,
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
              // duration: 5000,
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
                  <Typography>B???n c???n ho??n th??nh ??i???u ki???n sau:</Typography>
                  <Typography>
                    S??? ti???n n???p:
                    <span style={{ color: "#f01" }}>
                      {` ${
                        (parseInt(response?.data?.bonusValue) * 100) / 100
                      } `}
                    </span>{" "}
                    ??i???m
                  </Typography>
                  <Typography>
                    S??? l???n n???p: <span style={{ color: "#f01" }}>3</span> l???n tr???
                    l??n
                  </Typography>
                  <Typography>
                    KHI ?????T ????? ??I???U KI???N TR??N VUI L??NG CLICK V??O ????NG K?? NH???N
                    TH?????NG, H??? TH???NG S??? KI???M TRA V?? X??? L??!
                  </Typography>
                  <Space>
                    {response?.data?.trackingStatus !== 1 ? (
                      <Button
                        className="btn-789bet "
                        onClick={() => onRegister(response?.data?.userName)}
                        style={{
                          marginTop: 10,
                        }}
                      >
                        ????NG K?? NH???N TH?????NG
                      </Button>
                    ) : (
                      ""
                    )}

                    <Button
                      className="btn-789bet "
                      onClick={() => handleHistory(response?.data?.userName)}
                      style={{
                        marginTop: 10,
                      }}
                    >
                      L???CH S???
                    </Button>
                  </Space>
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

  const handleHistory = async (userName) => {
    const _req = {
      userName: userName,
      siteName: siteName,
      timeZone: new Date().getTimezoneOffset(),
    };
    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_CHANGE_STATUS_HISTORY}?${qs.stringify(
        _req
      )}`
    );
    setDataHistory(_res?.data || []);
    setIsModalOpenHistory(true);
  };

  const onRegister = async (username) => {
    const _req = {
      userName: username,
      fp: fingerPrint,
      ip: ip,
      bankName: form.getFieldValue().bankName,
      siteName: siteName,
    };

    const _res = await axios.post(
      `${api.API_URL}${API_CUSTOMER_REGISTER}?${qs.stringify(_req)}`
    );

    if (_res?.data?.status === 0) {
      return apiNoti["success"]({
        message: "Th??nh c??ng",
        placement: "center",
        description: (
          <>
            <Typography>????ng k?? nh???n th?????ng th??nh c??ng!</Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 1) {
      return apiNoti["warning"]({
        message: "C???nh b??o",
        placement: "center",
        description: (
          <>
            <Typography>B???n ???? ????ng k?? nh???n th?????ng!</Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 2) {
      return apiNoti["warning"]({
        message: "C???nh b??o",
        placement: "center",
        description: (
          <>
            <Typography>H??? th???ng ??ang x??? l??!</Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 3) {
      return apiNoti["warning"]({
        message: "C???nh b??o",
        placement: "center",
        description: (
          <>
            <Typography>
              S??? l???n n???p v?? t???ng s??? ti???n n???p ch??a ?????t y??u c???u!
            </Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 4) {
      return apiNoti["warning"]({
        message: "C???nh b??o",
        placement: "center",
        description: (
          <>
            <Typography>
              T??i kho???n c???a b???n kh??ng ???????c ph??p nh???n khuy???n m??i n??y!
            </Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 5) {
      return apiNoti["warning"]({
        message: "C???nh b??o",
        placement: "center",
        description: (
          <>
            <Typography>
              Vui l??ng ki???m tra l???i th??ng tin t??i kho???n ng??n h??ng!
            </Typography>
          </>
        ),
      });
    } else {
      return apiNoti["error"]({
        message: "L???i",
        placement: "center",
        description: (
          <>
            <Typography>
              T??i kho???n c???a b???n kh??ng c?? trong tr????ng ch??nh khuy???n m??i n??y!
            </Typography>
          </>
        ),
      });
    }
  };

  const handleImgVIP = (level) => {
    let _level = level.toString().toUpperCase().replace("VIP", "").trim();

    switch (_level) {
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

  const handleOkHistory = () => {
    setIsModalOpenHistory(false);
  };

  const handleCancelHistory = () => {
    setIsModalOpenHistory(false);
  };

  return (
    <div className="wrapper bet789">
      {contextHolder}
      <ClientJs setFingerPrint={setFingerPrint} />
      <div className="container">
        <Row>
          <Col xs={24} style={{ textAlign: "center" }}>
            <Image src={logo} alt="789bet" width={200} />
          </Col>
          <Col xs={24} style={{ textAlign: "center" }}>
            <h1 className="title-789bet title1">
              CASINO - T??I CH??? CH???N 789BET
            </h1>
            <h2 className="title-789bet title2">M???T CH??? T??N V???N CH??? TIN</h2>
            <h2 className="title-789bet title2">
              Ch??o m???ng th??nh vi??n tr??? l???i v???i 789BET
            </h2>
          </Col>
        </Row>
        <Form
          form={form}
          name="form-check-customer-info"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={[4, 4]} className="box-check-customer-info">
            <Col xs={24} className="text-center"></Col>
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
                title="Cho ??i M???t Ch??? T??n - Nh???n L???i V???n Ch??? Tin"
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
                width={700}
                style={{ top: 20 }}
              >
                <p>
                  Ch??n th??nh c???m ??n qu?? h???i vi??n ???? lu??n tin t?????ng v?? ???ng h???
                  789BET
                </p>
                <p>
                  <b>??? M??: </b>
                  <span style={{ color: "#f01" }}>
                    <b>SVIP</b>
                  </span>
                </p>
                <p>
                  <b>??? Th???i gian b???t ?????u:</b> 00:00:00 21/02/2023 (Gi??? h??? th???ng)
                </p>
                <p>
                  <b>??? Th???i gian k???t th??c:</b> 23:59:59 10/03/2023 (Gi??? h???
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
                    color: "#ff6a00",
                  }}
                >
                  789BET.COM
                </p>

                <p>
                  <b>??? N???i dung s??? ki???n:</b>T???t c??? th??nh vi??n ???? t???ng tham gia
                  t???i 789BET ?????t t??? c???p{" "}
                  <span style={{ color: "#f01" }}>VIP 1 </span>
                  tr??? l??n khi tr??? l???i tham gia t???i 789BET s??? nh???n ???????c ph???n
                  th?????ng mi???n ph?? t????ng ???ng t???i ??a l??n ?????n
                  <span style={{ color: "#f01" }}> 128.888.000 VND</span>. Chi
                  ti???t nh?? sau:
                </p>

                <table className="table-789bet">
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
                      <td>28</td>
                      <td rowSpan={20}>2 V??ng</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>38</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>68</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>288</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>528</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>1.088</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>1.588</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>2.288</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>3.888</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>5.288</td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td>5.888</td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td>6.888</td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td> 8.888</td>
                    </tr>
                    <tr>
                      <td>14</td>
                      <td>10.888</td>
                    </tr>
                    <tr>
                      <td>15</td>
                      <td>12.888</td>
                    </tr>
                    <tr>
                      <td>16</td>
                      <td>18.888</td>
                    </tr>
                    <tr>
                      <td>17</td>
                      <td>18.888</td>
                    </tr>
                    <tr>
                      <td>18</td>
                      <td>68.888</td>
                    </tr>
                    <tr>
                      <td>19</td>
                      <td>88.888</td>
                    </tr>
                    <tr>
                      <td>20</td>
                      <td>128.888</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  <b>??? ??i???u ki???n nh???n th?????ng:</b> (t??nh t??? ng??y 21/02/2023 tr???
                  ??i.)
                </p>
                <p>
                  {" "}
                  - C?? t??? 3 l???n n???p ti???n tr??? l??n. (Kh??ng t??nh l???n n???p ?????u nh???n
                  khuy???n m??i 100% v?? 200%)
                </p>
                <p> - S??? ti???n n???p ph???i ?????t 100% ti???n th?????ng.</p>
                <p>
                  - T??i kho???n t??? ng??y 14/01/2023 tr??? v??? sau c?? thay ?????i th??ng
                  tin ng??n h??ng kh??ng ???????c tham gia ch????ng tr??nh n??y.
                </p>
                <p>
                  <b>??? V?? d???: </b>Th??nh vi??n c?? VIP 8 nh???n th?????ng mi???n ph?? l??
                  2,288 ??i???m (ti???n n???p v??o l???n h??n 3 l???n : 1000 + 1000 + 288=
                  2,288 ??i???m), th??nh vi??n c?? ti???n n???p t??? 2,288 ??i???m tr??? l??n s???
                  nh???n ???????c ph???n th?????ng VIP t????ng ???ng.
                </p>
                <p>
                  <b>L???i ng???: </b>????? ch??n th??nh c???m ??n to??n b??? h???i vi??n ???? tin
                  t?????ng th????ng hi???u 789BET, khi ??? h??? th???ng c?? b???n ??ang l?? th??nh
                  vi??n VIP 789BET chuy???n sang h??? th???ng m???i ch??ng t??i v???n b???o l??u
                  c???p VIP c???a b???n cho ?????n khi ho??n th??nh n??ng c???p h??? th???ng VIP
                  m???i, ?????ng th???i t???ng mi???n ph?? ph???n th?????ng VIP khi tham gia tr??n
                  h??? th???ng m???i. B???n h??y nh???p ?????y ????? v?? ch??nh x??c th??ng tin ?????
                  bi???t ch??nh x??c v??{" "}
                  <a
                    href="https://tawk.to/chat/638c28fcb0d6371309d28305/1gjdo07e2"
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
                  className="btn-789bet"
                  htmlType="submit"
                  loading={loading}
                >
                  KI???M TRA NGAY
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title="L???ch s??? ????ng k?? nh???n th?????ng"
          open={isModalOpenHistory}
          onOk={handleOkHistory}
          onCancel={handleCancelHistory}
          footer={null}
          style={{ top: 20 }}
        >
          {dataHistory && dataHistory.length > 0 ? (
            dataHistory.reverse().map((item, i) => {
              return (
                <>
                  <Typography key={i}>
                    {`L???n ${i + 1}: ${dayjs(item.createdDate).format(
                      "DD/MM/YYYY HH:mm"
                    )} ${
                      item?.bonusStatus === 0
                        ? "(????ng k?? nh???n th?????ng th??nh c??ng)"
                        : item?.bonusStatus === 1
                        ? "(Nh???n th?????ng th??nh c??ng)"
                        : item?.bonusStatus === 2
                        ? "(??ang x??? l??)"
                        : item?.bonusStatus === 3
                        ? "(T??? ch???i)"
                        : ""
                    }`}
                  </Typography>
                </>
              );
            })
          ) : (
            <Typography>B???n ch??a ????ng k?? nh???n th?????ng!</Typography>
          )}
        </Modal>
      </div>
    </div>
  );
}
