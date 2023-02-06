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

export default function Home() {
  const [form] = Form.useForm();
  const [fingerPrint, setFingerPrint] = useState();
  const [loading, setLoading] = useState(false);
  const [apiNoti, contextHolder] = notification.useNotification();
  const [listBank, setListBank] = useState([]);

  useEffect(() => {
    getListBank();
  }, []);

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
        userName: values.userName,
        fullName: values.fullName,
        bankNum: values.bankNum,
        bankName: values.bankName,
        fp: fingerPrint,
      };

      console.log(qs.stringify(data));

      await axios
        .post(`${api.API_URL}${API_CHECK_CUSTOMER_INFO}?${qs.stringify(data)}`)
        .then(function (response) {
          if (response?.data?.status === 0) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              description: <Typography>Tài khoản không tồn tại!</Typography>,
            });
          } else if (response?.data?.status === 2) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              description: <Typography>Sai họ và tên!</Typography>,
            });
          } else if (response?.data?.status === 3) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              description: <Typography>Sai tên ngân hàng!</Typography>,
            });
          } else if (response?.data?.status === 4) {
            setLoading(false);
            apiNoti["error"]({
              message: "Thất bại",
              description: <Typography>Sai số tài khoản ngân hàng!</Typography>,
            });
          } else {
            setLoading(false);
            apiNoti["success"]({
              message: "Thành công",
              description: (
                <>
                  <Typography>
                    Tài khoản: {response?.data?.userName}{" "}
                  </Typography>
                  <Typography>Cấp VIP: {response?.data?.level} </Typography>
                  <Typography>
                    Thưởng miễn phí: {response?.data?.bonusValue}{" "}
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
                </>
              ),
            });
          }
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
                  placeholder="Chọn ngần hàng"
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
                label="STK ngân hàng"
                name="bankNum"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tài khoản ngân hàng!",
                  },
                ]}
              >
                <InputNumber controls={false} style={{ width: "100%" }} />
              </Form.Item>
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
