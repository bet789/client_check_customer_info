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
              // duration: 5000,
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
                  <Typography>
                    KHI ĐẠT ĐỦ ĐIỀU KIỆN TRÊN VUI LÒNG CLICK VÀO ĐĂNG KÝ NHẬN
                    THƯỞNG, HỆ THỐNG SẼ KIỂM TRA VÀ XỬ LÝ!
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
                        ĐĂNG KÝ NHẬN THƯỞNG
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
                      LỊCH SỬ
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
            message: "Thất bại",
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
        message: "Thành công",
        placement: "center",
        description: (
          <>
            <Typography>Đăng ký nhận thưởng thành công!</Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 1) {
      return apiNoti["warning"]({
        message: "Cảnh báo",
        placement: "center",
        description: (
          <>
            <Typography>Bạn đã đăng ký nhận thưởng!</Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 2) {
      return apiNoti["warning"]({
        message: "Cảnh báo",
        placement: "center",
        description: (
          <>
            <Typography>Hệ thống đang xử lý!</Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 3) {
      return apiNoti["warning"]({
        message: "Cảnh báo",
        placement: "center",
        description: (
          <>
            <Typography>
              Số lần nạp và tổng số tiền nạp chưa đạt yêu cầu!
            </Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 4) {
      return apiNoti["warning"]({
        message: "Cảnh báo",
        placement: "center",
        description: (
          <>
            <Typography>
              Tài khoản của bạn không được phép nhận khuyến mãi này!
            </Typography>
          </>
        ),
      });
    } else if (_res?.data?.status === 5) {
      return apiNoti["warning"]({
        message: "Cảnh báo",
        placement: "center",
        description: (
          <>
            <Typography>
              Vui lòng kiểm tra lại thông tin tài khoản ngân hàng!
            </Typography>
          </>
        ),
      });
    } else {
      return apiNoti["error"]({
        message: "Lỗi",
        placement: "center",
        description: (
          <>
            <Typography>
              Tài khoản của bạn không có trong trương chình khuyến mãi này!
            </Typography>
          </>
        ),
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
              CASINO - TÔI CHỈ CHỌN 789BET
            </h1>
            <h2 className="title-789bet title2">MỘT CHỮ TÍN VẠN CHỮ TIN</h2>
            <h2 className="title-789bet title2">
              Chào mừng thành viên trở lại với 789BET
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
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} className="text-center policy">
              <Typography.Link italic onClick={showModal}>
                Điều khoản và chính sách
              </Typography.Link>
              <Modal
                title="Cho Đi Một Chữ Tín - Nhận Lại Vạn Chữ Tin"
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
                width={700}
                style={{ top: 20 }}
              >
                <p>
                  Chân thành cảm ơn quý hội viên đã luôn tin tưởng và ủng hộ
                  789BET
                </p>
                <p>
                  <b>※ Mã: </b>
                  <span style={{ color: "#f01" }}>
                    <b>SVIP</b>
                  </span>
                </p>
                <p>
                  <b>※ Thời gian bắt đầu:</b> 00:00:00 21/02/2023 (Giờ hệ thống)
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
                    color: "#ff6a00",
                  }}
                >
                  789BET.COM
                </p>

                <p>
                  <b>※ Nội dung sự kiện:</b>Tất cả thành viên đã từng tham gia
                  tại 789BET đạt từ cấp{" "}
                  <span style={{ color: "#f01" }}>VIP 1 </span>
                  trở lên khi trở lại tham gia tại 789BET sẽ nhận được phần
                  thưởng miễn phí tương ứng tối đa lên đến
                  <span style={{ color: "#f01" }}> 128.888.000 VND</span>. Chi
                  tiết như sau:
                </p>

                <table className="table-789bet">
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
                      <td>28</td>
                      <td rowSpan={20}>1 Vòng</td>
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
                  <b>※ Điều kiện nhận thưởng:</b> (tính từ ngày 21/02/2023 trở
                  về sau)
                </p>
                <p>
                  {" "}
                  - Có từ 3 lần nạp tiền trở lên. (Không tính lần nạp đầu nhận
                  khuyến mãi 100% và 200%)
                </p>
                <p> - Số tiền nạp phải đạt 100% tiền thưởng.</p>
                <p>
                  - Tài khoản từ ngày 14/01/2023 trở về sau có thay đổi thông
                  tin ngân hàng không được tham gia chương trình này.
                </p>
                <p>
                  <b>※ Ví dụ: </b>Thành viên có VIP 8 nhận thưởng miễn phí là
                  2,288 điểm (tiền nạp vào lớn hơn 3 lần : 1000 + 1000 + 288=
                  2,288 điểm), thành viên có tiền nạp từ 2,288 điểm trở lên sẽ
                  nhận được phần thưởng VIP tương ứng.
                </p>
                <p>
                  <b>Lời ngỏ: </b>Để chân thành cảm ơn toàn bộ hội viên đã tin
                  tưởng thương hiệu 789BET, khi ở hệ thống cũ bạn đang là thành
                  viên VIP 789BET chuyển sang hệ thống mới chúng tôi vẫn bảo lưu
                  cấp VIP của bạn cho đến khi hoàn thành nâng cấp hệ thống VIP
                  mới, đồng thời tặng miễn phí phần thưởng VIP khi tham gia trên
                  hệ thống mới. Bạn hãy nhập đầy đủ và chính xác thông tin để
                  biết chính xác và{" "}
                  <a
                    href="https://tawk.to/chat/638c28fcb0d6371309d28305/1gjdo07e2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    liên hệ chăm sóc khách hàng
                  </a>{" "}
                  đăng ký nhận thưởng.
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
                  KIỂM TRA NGAY
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Modal
          title="Lịch sử đăng ký nhận thưởng"
          open={isModalOpenHistory}
          onOk={handleOkHistory}
          onCancel={handleCancelHistory}
          footer={null}
          style={{ top: 20 }}
        >
          {console.log(dataHistory)}
          {dataHistory && dataHistory.length > 0 ? (
            dataHistory.reverse().map((item, i) => {
              return (
                <>
                  <Typography key={i}>
                    {`Lần ${i + 1}: ${dayjs(item.createdDate).format(
                      "DD/MM/YYYY HH:mm"
                    )} ${
                      item?.bonusStatus === 0
                        ? "(Đăng ký nhận thưởng thành công)"
                        : item?.bonusStatus === 1
                        ? "(Nhận thưởng thành công)"
                        : item?.bonusStatus === 2
                        ? "(Đang xử lý)"
                        : item?.bonusStatus === 3
                        ? "(Từ chối)"
                        : ""
                    }`}
                  </Typography>
                </>
              );
            })
          ) : (
            <Typography>Bạn chưa đăng ký nhận thưởng!</Typography>
          )}
        </Modal>
      </div>
    </div>
  );
}
