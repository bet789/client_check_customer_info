import React, { useState } from "react";
import DataPage from "@/components/data";
import { Button, Form, Input, notification, Typography } from "antd";
import { accountAdmin, accountStaff } from "@/helpers/config";
import { LoginOutlined } from "@ant-design/icons";

export default function DataPages() {
  const [isAuth, setIsAuth] = useState(false);
  const [apiNoti, contextHolder] = notification.useNotification();
  const [userName, setUserName] = useState("");

  const onFinish = (values) => {
    if (
      (values.username === accountAdmin.username &&
        values.password === accountAdmin.password) ||
      (values.username === accountStaff.username &&
        values.password === accountStaff.password)
    ) {
      setUserName(values.username);
      setIsAuth(true);
    } else {
      apiNoti["error"]({
        message: "Thất bại",
        description: (
          <Typography>
            Vui lòng liên hệ bộ phận kỹ thuật để được cấp tài khoản!
          </Typography>
        ),
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <div className="wrapper">
        <div className="container" style={{ textAlign: "center" }}>
          {!isAuth ? (
            <Form
              name="form-login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LoginOutlined />}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <DataPage username={userName} />
          )}
        </div>
      </div>
    </>
  );
}
