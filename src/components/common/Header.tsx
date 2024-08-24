import { HEADER_MODAL_TAB } from "@/data/tab";
import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AlertWindow from "../alert/AlertWindow";
import { useDispatch } from "react-redux";
import { clearTokens } from "@/utils/storage";
import { getProfileBgColor } from "@/utils/profile";
import { clearUserProfile } from "@/redux/slices/userSlice";
import { getNotiCount } from "@/api/notification";

interface HeaderProps {
  selected: boolean;
}

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isAlertWindow, setIsAlertWindow] = useState<Boolean>(false);
  const [isMyPage, setIsMyPage] = useState<Boolean>(false);

  const [name, setName] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  const myPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("name");
      const storedProfileImg = localStorage.getItem("profileImg");
      setName(storedName);
      setProfileImg(storedProfileImg);
    }
  }, []);

  /* 알림창 열고 닫는 함수 */
  const handleAlertWindow = () => {
    setIsAlertWindow(!isAlertWindow);
  };

  /* 외부 영역 클릭시 팝업 닫힘 */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      myPageRef.current &&
      !myPageRef.current.contains(event.target as Node)
    ) {
      setIsMyPage(false);
    }
  };

  useEffect(() => {
    if (isMyPage) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [isMyPage]);

  /* 페이지 이동 시 팝업창 닫음 */
  useEffect(() => {
    setIsAlertWindow(false);
    setIsMyPage(false);
  }, [pathname]);

  useEffect(() => {
    const fetchNotiCount = async () => {
      try {
        const response = await getNotiCount();
        setCount(response.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotiCount();
  }, []);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <Head>
      <HeaderBar>
        <Left>
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              width={102}
              height={32}
              alt="logo"
            />
          </Link>
          <Menus>
            <Menu href="/match" selected={pathname.includes("/match")}>
              바로 매칭
            </Menu>
            <Bar />
            <Menu href="/board" selected={pathname === "/board"}>
              매칭 게시판
            </Menu>
          </Menus>
        </Left>
        {name && profileImg ? (
          <Right>
            <Image
              src={`/assets/icons/noti_${count > 0 ? "on" : "off"}.svg`}
              width={24}
              height={30}
              alt="noti"
              onClick={handleAlertWindow}
            />
            <Profile>
              <HeaderProfileImgWrapper $bgColor={getProfileBgColor(parseInt(profileImg))}>
                <HeaderProfileImg
                  src={`/assets/images/profile/profile${profileImg}.svg`}
                  width={29}
                  height={29}
                  alt="profile"
                />
              </HeaderProfileImgWrapper>
              {name}
              <button onClick={() => setIsMyPage(!isMyPage)}>
                <Image
                  src="/assets/icons/chevron_down.svg"
                  width={7}
                  height={7}
                  alt="more"
                />
              </button>
            </Profile>
          </Right>
        ) : (
          <Login onClick={() => router.push("/login")}>로그인</Login>
        )}
      </HeaderBar>
      {isAlertWindow && <AlertWindow onClose={() => setIsAlertWindow(false)} />}
      {isMyPage && (
        <MyPageModal ref={myPageRef}>
          <MyProfile>
            {profileImg &&
              <ProfileImgWrapper $bgColor={getProfileBgColor(parseInt(profileImg))}>
                <ProfileImg
                  src={`/assets/images/profile/profile${profileImg}.svg`}
                  width={52}
                  height={52}
                  alt="profile"
                />
              </ProfileImgWrapper>
            }
            <MyName>{name}</MyName>
            <Image
              src={`/assets/icons/noti_${count > 0 ? "on" : "off"}.svg`}
              width={24}
              height={30}
              alt="noti"
              onClick={() => {
                router.push("/mypage/notification");
                setIsMyPage(false);
              }}
              style={{ cursor: "pointer" }}
            />
          </MyProfile>
          <TabMenu>
            {HEADER_MODAL_TAB.map((data, index) => (
              <>
                <Line
                  key={data.id}
                  onClick={() => {
                    if (data.url) {
                      router.push(`${data.url}`);
                    } else {
                      clearTokens();
                      dispatch(clearUserProfile());
                      router.push("/");
                      window.location.reload();
                    }
                  }}
                >
                  <Image
                    src={`/assets/icons/${data.icon}.svg`}
                    width={20}
                    height={20}
                    alt={`${data.icon}`}
                  />
                  {data.menu}
                </Line>
                {index === 2 && <Divider />}
              </>
            ))}
          </TabMenu>
        </MyPageModal>
      )}
    </Head>
  );
};

export default Header;

const Head = styled.div`
  width: 100%;
  margin-top: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  ${(props) => props.theme.fonts.regular14};
  position: absolute;
  top: 0;
`;

const HeaderBar = styled.div`
  max-width: 1440px;
  box-sizing: border-box;
  padding: 0 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`;

const Menus = styled.div`
  display: flex;
  gap: 25px;
`;

const Menu = styled(Link) <HeaderProps>`
  font-weight: ${({ selected }) => (selected ? "700" : "400")};
`;

const Bar = styled.div`
  width: 0.5px;
  height: 18.5px;
  background: #d7d7d7;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeaderProfileImgWrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 37px;
    height: 37px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
`;

const HeaderProfileImg = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    `;

const Login = styled.button`
color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold14}
`;

const MyPageModal = styled.div`
width: 408px;
border-radius: 10px;
padding: 25px 27px;
background: ${theme.colors.white};
box-shadow: 2px 11px 44.1px 0px rgba(0, 0, 0, 0.15);
position: absolute;
top: 50px;
right: 50px;
z-index: 100;
`;

const MyProfile = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 0 9px 23px 9px;
border-bottom: 1px solid #d4d4d4;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
position: relative;
width: 75px;
height: 75px;
background: ${(props) => props.$bgColor};
border-radius: 50%;
`;

const ProfileImg = styled(Image)`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`;

const MyName = styled.div`
margin-left: 15px;
margin-right: auto;
color: ${theme.colors.black};
  ${(props) => props.theme.fonts.bold20};
white-space: nowrap;
`;

const TabMenu = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: center;
padding-top: 18px;
gap: 4px;
color: ${theme.colors.black};
  ${(props) => props.theme.fonts.semiBold18};
`;

const Line = styled.div`
width: 100%;
height: 52px;
display: flex;
justify-content: flex-start;
align-items: center;
padding-left: 9px;
gap: 18px;
cursor: pointer;
border-radius: 10px;

  &:hover {
  background: ${theme.colors.gray500};
}
`;

const Divider = styled.div`
width: 100%;
height: 1px;
background-color: #d4d4d4;
margin: 18px 0;
`;
