import icons from "./icons";
const { LuPenSquare, MdOutlineManageAccounts, HiOutlineInformationCircle } =
  icons;
const menuManage = [
  // {
  //   id: 1,
  //   text: "Đăng Trãi Nghiệm",
  //   path: "/he-thong/tao-moi-bai-dang",
  //   icon: <LuPenSquare />,
  // },
  // {
  //   id: 2,
  //   text: "Quản lý tin đăng",
  //   path: "/he-thong/quan-ly-dang",
  //   icon: <MdOutlineManageAccounts />,
  // },
  {
    id: 3,
    text: "Thông tin tài khoản",
    path: "/he-thong/sua-thong-tin-ca-nhan",
    icon: <HiOutlineInformationCircle />,
  },
  {
    id: 4,
    text: "Quản lý đơn hàng",
    path: "/he-thong/quan-ly-don-hang",
    icon: <HiOutlineInformationCircle />,
  },
];
export default menuManage;
