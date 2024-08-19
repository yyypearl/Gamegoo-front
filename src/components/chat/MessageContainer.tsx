import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { setChatDateFormatter, setChatTimeFormatter } from '@/utils/custom';
import ConfirmModal from '../common/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseMannerStatusModal, setCloseReadingModal, setOpenMannerStatusModal, setOpenReadingModal } from '@/redux/slices/modalSlice';
import { RootState } from '@/redux/store';
import { Chat, ChatMessageDto, ChatMessageList } from '@/interface/chat';
import ReadBoard from '../readBoard/ReadBoard';
import { useRouter } from 'next/navigation';
import { getProfileBgColor } from '@/utils/profile';

interface MessageContainerProps {
  message: Chat;
}

interface SystemMessageProps {
  message: string;
  onClick?: () => void;
}

const MessageContainer = (props: MessageContainerProps) => {
  const { message } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const isFeedbackModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);

  const [messageList, setMessageList] = useState<ChatMessageList>();
  const [isFeedbackDateVisible, setIsFeedbackDateVisible] = useState(false);
  const [isFeedbackDate, setIsFeedbackDate] = useState("");
  const [isBoardId, setIsBoardId] = useState(0);

  const handleMannerTypeClose = () => {
    dispatch(setCloseMannerStatusModal());
  };

  useEffect(() => {
    setMessageList(message?.chatMessageList);
  }, [message])

  const handleDisplayDate = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === 0) return true;

    const currentDate = dayjs(messages[index].createdAt).format('YYYY-M-D');
    const previousDate = dayjs(messages[index - 1].createdAt).format('YYYY-M-D');

    return currentDate !== previousDate;
  };

  const handleDisplayProfileImage = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === 0) return true;

    return messages[index].senderId !== message.memberId;
  };

  const handleDisplayTime = (messages: ChatMessageDto[], index: number): boolean => {
    if (index === messages.length - 1) return true;

    const currentTime = dayjs(messages[index].createdAt).format('A hh:mm');
    const nextTime = dayjs(messages[index + 1].createdAt).format('A hh:mm');

    const isSameTime = currentTime === nextTime;
    const isSameSender = messages[index].senderId !== message.memberId

    /* 시간과 보낸 사람이 같으면 마지막 메시지에만 시간 표시 */
    return !isSameTime || !isSameSender;
  };

  /* 마지막 채팅을 보낸 날짜에서 1시간을 더했을 때, 마지막 보낸 채팅 날짜랑 피드백 날짜가 다를 때만 보여주기 */
  useEffect(() => {
    const lastMessage = messageList?.chatMessageDtoList[messageList.chatMessageDtoList.length - 1];
    const feedbackTimestamp = dayjs(lastMessage?.createdAt).add(1, 'hour');
    const feedbackFullDate = dayjs(feedbackTimestamp).format('YYYY-MM-DDTHH:mm:ss');

    const feedbackDate = dayjs(feedbackTimestamp).format('YYYY-M-D');
    const lastMessageDate = dayjs(lastMessage?.createdAt).format('YYYY-M-D');

    setIsFeedbackDate(feedbackFullDate);

    if (feedbackDate !== lastMessageDate) {
      setIsFeedbackDateVisible(true);
    }
  }, [messageList])

  /* 게시글 열기 */
  const handlePostOpen = (id: number) => {
    dispatch(setOpenReadingModal());
    setIsBoardId(id);
  };

  /* 게시글 닫기 */
  const handlePostClose = () => {
    dispatch(setCloseReadingModal());
  };

  /* 시스템 메시지를 처리하는 컴포넌트 */
  const SystemMessage = (props: SystemMessageProps) => {
    const { message, onClick } = props;

    const highlightedText = "게시한 글";
    const parts = message.split(highlightedText);

    return (
      <SystemMessageContainer>
        {parts.length > 1 ? (
          <>
            {parts[0]}
            <UnderlinedText onClick={onClick}>{highlightedText}</UnderlinedText>
            {parts[1]}
          </>
        ) : (
          message
        )}
      </SystemMessageContainer>
    );
  };

  return (
    <>
      {isReadingModal &&
        <ReadBoard onClose={handlePostClose} postId={isBoardId} />
      }
      {messageList?.chatMessageDtoList.map((data, index) => {
        const hasProfileImage = handleDisplayProfileImage(messageList.chatMessageDtoList, index);
        const showTime = handleDisplayTime(messageList.chatMessageDtoList, index);

        return (
          <MsgContainer
            key={data.timestamp}>
            {handleDisplayDate(messageList.chatMessageDtoList, index) && (
              <Timestamp>{setChatDateFormatter(data.createdAt)}</Timestamp>
            )}
            {data.senderName === "SYSTEM" ? (
              <SystemMessage
                onClick={data.boardId ? () => handlePostOpen(data.boardId as number) : undefined}
                message={data.message} />
            ) :
              data.senderId !== message.memberId ? (
                <YourMessageContainer>
                  {handleDisplayProfileImage(messageList.chatMessageDtoList, index) && (
                    <>
                      <ImageWrapper $bgColor={getProfileBgColor(data.senderProfileImg)}>
                        <ProfileImage
                          onClick={() => router.push("/user")}
                          src={`/assets/images/profile/profile${data.senderProfileImg}.svg`}
                          width={38}
                          height={38}
                          alt="프로필 이미지" />
                      </ImageWrapper>
                    </>
                  )}
                  <YourDiv $hasProfileImage={hasProfileImage}>
                    <YourMessage>{data.message}</YourMessage>
                    {showTime ? <YourDate>{setChatTimeFormatter(data.createdAt)}</YourDate> : null}
                  </YourDiv>
                </YourMessageContainer>
              ) : (
                <MyMessageContainer>
                  <MyDiv>
                    {showTime ? <MyDate>{setChatTimeFormatter(data.createdAt)}</MyDate> : null}
                    <MyMessage>{data.message}</MyMessage>
                  </MyDiv>
                </MyMessageContainer>
              )
            }
          </MsgContainer>
        )
      })}

      {isFeedbackDateVisible &&
        <FeedbackDate className={isFeedbackDateVisible ? 'visibleDate' : 'invisibleDate'}>
          <Timestamp>{setChatDateFormatter(isFeedbackDate)}</Timestamp>
        </FeedbackDate>
      }
      <FeedbackDiv className={isFeedbackDateVisible ? 'visibleDate' : 'invisibleDate'}>
        <FeedbackContainer>
          <Image
            src="/assets/icons/gray_circle.svg"
            width={47.43}
            height={47.43}
            alt="프로필 이미지" />
          <Feedback>
            <Text>매칭은 어떠셨나요?</Text>
            <Text>상대방의 매너를 평가해주세요!</Text>
            <SmileImage
              src="/assets/icons/clicked_smile.svg"
              width={22}
              height={22}
              alt="스마일 이모티콘" />
            <Button onClick={() => dispatch(setOpenMannerStatusModal())}>
              매너평가 하기
            </Button>
          </Feedback>
        </FeedbackContainer>
        <FeedbackTime>{setChatTimeFormatter(isFeedbackDate)}</FeedbackTime>
      </FeedbackDiv>
      {isFeedbackModalOpen &&
        <ConfirmModal
          type="manner"
          width="315px"
          primaryButtonText="확인"
          onPrimaryClick={handleMannerTypeClose} />
      }
    </>
  )
};

export default MessageContainer;

const MsgContainer = styled.div``;

const Timestamp = styled.p`
    max-width: 79px;
    margin: 0 auto 10px auto;
    text-align: center;
    background: #000000A3;
    border-radius: 14px;
    padding: 4px 10px;
    ${(props) => props.theme.fonts.regular8};
    color: ${theme.colors.white}; 
`;

const YourMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
`;

const ImageWrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 47px;
    height: 47px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
`;

const ProfileImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
`;

const YourDiv = styled.div<{ $hasProfileImage: boolean }>`
  display: flex;
  align-items: end;
  margin-left: ${(props) =>
    props.$hasProfileImage ? "11px" : "58.43px"};
`;

const YourMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.white}; 
  border-radius: 13px;
  padding: 5px 13px;
  max-width: 229px;
  word-break:keep-all;
  overflow-wrap: break-word;
`;

const YourDate = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const MyMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const MyDiv = styled.div`
  display: flex;
  align-items: end;
`;

const MyMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.purple300}; 
  border-radius: 13px;
  padding: 5px 13px;
  max-width: 196px;
  word-break:keep-all;
  overflow-wrap: break-word;
`;

const MyDate = styled.p`
  margin-right:5px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const FeedbackDate = styled.div`
    &.visibleDate{
    margin-top: 35px;
  }
  &.invisibleDate{
    margin-top: unset;
  }

`;
const FeedbackDiv = styled.div`
  display: flex;
  align-items: end;
  &.visibleDate{
    margin-top: 10px;
  }
  &.invisibleDate{
    margin-top: 35px;
  }
`;

const FeedbackContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 229px;
  padding: 18px 15px 10px;
  background: ${theme.colors.white}; 
  border-radius: 13px;
  margin-left: 11px;
`;

const SmileImage = styled(Image)`
  margin-top: 12px;
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  &:first-child {
    margin-bottom: 5px;
    }
`;

const Button = styled.button`
  width: 100%;
  border-radius: 53px;
  margin-top:12px;
  ${(props) => props.theme.fonts.semiBold12};
  background: ${theme.colors.purple100}; 
  color: ${theme.colors.white}; 
  padding: 10px 0;
`;

const FeedbackTime = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const SystemMessageContainer = styled.div`
    width: 100%;
    text-align: center;
    padding:11px 0px;
    background: #000000A3;
    ${(props) => props.theme.fonts.regular12};
    color: ${theme.colors.white}; 
    border-radius: 14px;
    margin-bottom: 11px;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
`;