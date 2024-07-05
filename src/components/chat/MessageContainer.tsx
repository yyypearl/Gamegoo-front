import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatDateFormatter } from '@/utils/custom';

interface MessageInterface {
    user: string;
    msg: string;
    msgId: number;
    userId: number;
    date: string;
}
interface MessageContainerProps {
    messageList: MessageInterface[];
}

const MessageContainer = (props: MessageContainerProps) => {
    const { messageList } = props;

    return (
        <>
            {messageList.map((message, index) => {

                let displayTime = true;
                const timeValue = setChatDateFormatter(message.date);
                if (index !== messageList.length - 1) {
                    const nextSender = messageList[index + 1].userId;

                    if (nextSender === message.userId) {
                        const nextTimeValue = setChatDateFormatter(messageList[index + 1].date);

                        if (nextTimeValue === timeValue)
                            displayTime = false;
                    }
                }
                return (
                    <MsgContainer key={message.msgId}>
                        {message.user === "you" ? (
                            <YourMessageContainer>
                                <Image
                                    src="/assets/icons/gray_circle.svg"
                                    width={47.43}
                                    height={47.43}
                                    alt="프로필 이미지" />
                                <YourDiv>
                                    <YourMessage>{message.msg}</YourMessage>
                                    {displayTime ? <YourDate>{setChatDateFormatter(message.date)}</YourDate> : null}
                                </YourDiv>
                            </YourMessageContainer>
                        ) : (
                            <MyMessageContainer>
                                <MyDiv>
                                    {displayTime ? <MyDate>{setChatDateFormatter(message.date)}</MyDate> : null}
                                    <MyMessage>{message.msg}</MyMessage>
                                </MyDiv>
                            </MyMessageContainer>
                        )
                        }
                    </MsgContainer>
                )
            })}
            <FeedbackDiv>
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
                        <Button>
                            매너평가 하기
                        </Button>
                    </Feedback>
                </FeedbackContainer>
                <FeedbackDate>{setChatDateFormatter("2024-07-02 02:11")}</FeedbackDate>
            </FeedbackDiv>
        </>
    )
};

export default MessageContainer;

const MsgContainer = styled.div``;
const YourMessageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  align-items: center;
`;

const YourDiv = styled.div`
  display: flex;
  align-items: end;
  margin-left: 11px;
`;

const YourMessage = styled.div`
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray600}; 
  background: ${theme.colors.white}; 
  border-radius: 13px;
  padding: 8px 13px;
  max-width: 229px;
`;

const YourDate = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const MyMessageContainer = styled.div`
  display: flex;
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
  padding: 8px;
  max-width: 196px;
`;

const MyDate = styled.p`
  margin-right:5px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;

const FeedbackDiv = styled.div`
  display: flex;
  align-items: end;
`;

const FeedbackContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 35px;
`;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 229px;
  padding: 18px 15px 10px;
  background: ${theme.colors.white}; 
  border-radius: 13px;
  margin-left: 11px;
`;

const SmileImage = styled(Image)`
  margin-top: 12px;
`;

const Text = styled.p`
  &:first-child {
    margin-bottom: 8px;
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

const FeedbackDate = styled.p`
  margin-left:9px;
  ${(props) => props.theme.fonts.regular8};
  color: ${theme.colors.gray700}; 
`;
