import { setOpenEvaluationModal } from "@/redux/slices/modalSlice";
import { setMannerStatus } from "@/redux/slices/mannerStatusSlice";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

type ButtonText =
  | '취소'
  | '나가기'
  | '차단'
  | '확인'
  | '예'
  | '아니요'
  | '닫기'
  | '글 작성하기'
  | '글 보러하기'

interface ConfirmModalProps {
  type?: "manner";
  children?: string | React.ReactNode;
  width: string;
  borderRadius?: string;
  primaryButtonText: ButtonText;
  secondaryButtonText?: ButtonText;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
  yes?: string;
  no?: string;
  onCheck?: () => void;
  onClose?: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    type,
    children,
    width,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryClick,
    onSecondaryClick
    borderRadius,
    yes = "예",
    no = "아니요",
    onCheck,
    onClose,
  } = props;

  const dispatch = useDispatch();

  let buttonClassName = '';

  if (type !== 'manner') {
    if (primaryButtonText && secondaryButtonText) {
      buttonClassName = 'leftButton';
    } else if (primaryButtonText) {
      buttonClassName = 'wholeButton';
    }
  }

  const [mannerStatusClicked, setMannerStatusClicked] = useState(false);
  const [badMannerStatusClicked, setBadMannerStatusClicked] = useState(false);

  const handleMannerEvaluate = () => {
    setMannerStatusClicked((prevState) => !prevState);
    setBadMannerStatusClicked(false);
    dispatch(setMannerStatus("manner"));
  };

  const handleBadMannerEvaluate = () => {
    setBadMannerStatusClicked((prevState) => !prevState);
    setMannerStatusClicked(false);
    dispatch(setMannerStatus("badManner"));
  };

  const handleCheck = () => {
    dispatch(setOpenEvaluationModal());
    onPrimaryClick();
  };

  return (
    <Overlay>
      <Wrapper
        $width={width}
        $type={type}
        onClick={(e) => e.stopPropagation()}
      >
        <Main>
          {type === "manner" ? (
            <ImageTop>
              <CloseButton>
                <Image
                  onClick={onPrimaryClick}
                  src="/assets/icons/close.svg"
                  width={10}
                  height={10}
                  alt="닫기"
                />
              </CloseButton>
              <ImageWrapper>
                <ClickArea onClick={handleMannerEvaluate}>
                  <Image
                    src={
                      mannerStatusClicked
                        ? "/assets/icons/clicked_smile.svg"
                        : "/assets/icons/smile.svg"
                    }
                    width={33}
                    height={33}
                    alt="매너"
                  />
                  <MannerText>매너 평가하기</MannerText>
                </ClickArea>
                <ClickArea onClick={handleBadMannerEvaluate}>
                  <Image
                    src={
                      badMannerStatusClicked
                        ? "/assets/icons/clicked_sad.svg"
                        : "/assets/icons/sad.svg"
                    }
                    width={33}
                    height={33}
                    alt="비매너"
                  />
                  <MannerText>비매너 평가하기</MannerText>
                </ClickArea>
              </ImageWrapper>
            </ImageTop>
          ) : (
            <TextTop>{children}</TextTop>
          )}
        </Main>
        <Footer>
          <ButtonWrapper>
            <Button

              onClick={type ? handleCheck : onPrimaryClick}
              className={buttonClassName}
              disabled={
                type === "manner" &&
                !mannerStatusClicked &&
                !badMannerStatusClicked
              }
              $type={type}>
              {primaryButtonText}
            </Button>
            {secondaryButtonText && onSecondaryClick && (
              <Button
                onClick={onSecondaryClick}
                className="rightButton"
                $type={type}>
                {secondaryButtonText}

                onClick={onCheck || onClose}
                className={type === "manner" ? undefined : "noButton"}
                disabled={
                  type === "manner" &&
                  !mannerStatusClicked &&
                  !badMannerStatusClicked
                }
                $type={type}
            >
                {type === "yesOrNo" ? yes : "확인"}
              </Button>
            {type === "yesOrNo" && (
              <Button onClick={onClose} className="noButton" $type={type}>
                {no}

              </Button> -- >
            )}
          </ButtonWrapper>
        </Footer>
      </Wrapper>
    </Overlay>
  );
};

export default ConfirmModal;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  z-index: 100;
`;

const Wrapper = styled.div<{ $width: string; $type: string | undefined }>`
  width: ${({ $width }) => $width};
  background: ${theme.colors.white};
  border-radius: ${({ $type }) => $type ? "10px" : "20px"};
  box-shadow: 0 0 14.76px 0 rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const Main = styled.main`
  padding: 0 4px;
`;

const ImageTop = styled.div`
  border-bottom: 0.58px solid rgba(197, 197, 199, 1);
`;

const TextTop = styled.div`
  min-height: 189px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 0.58px solid rgba(197, 197, 199, 1);
  ${(props) => props.theme.fonts.regular25};
`;

const CloseButton = styled.p`
  display: flex;
  padding: 13px 15px 0;
  margin-bottom: 5px;
  img {
    margin-left: auto;
    cursor: pointer;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 15px;
`;

const ClickArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MannerText = styled.p`
  ${(props) => props.theme.fonts.regular14};
  color: #2d2d2d;
  margin-top: 11px;
`;

const Footer = styled.footer``;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<{ $type: string | undefined }>`
  text-align: center;
  ${({ $type }) =>
    $type ? `${theme.fonts.bold11}` : `${theme.fonts.semiBold18}`};
  cursor: pointer;
  color: ${({ $type }) => ($type ? `${theme.colors.gray600}` : `${theme.colors.gray700}`)};
  width: 100%;
  height: 79px;
  padding: 15px 0;
  &:disabled {
    color: ${theme.colors.gray300};
  }

  &.leftButton {
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.purple100};
      background: ${theme.colors.gray500};
      border-radius: 0 0 0 20px;
    }
  }

  &.rightButton {
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.purple100};
      background: ${theme.colors.gray500};
      border-radius: 0 0 20px 0;
    }
  }

  &.wholeButton {
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.purple100};
      background: ${theme.colors.gray500};
      border-radius: 0 0 20px 20px;
    }
  }
`;
