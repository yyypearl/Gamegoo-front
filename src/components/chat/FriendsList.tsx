import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { Dispatch, useEffect, useRef, useState } from 'react';
import DeleteFriend from './DeleteFriend';

interface FriendListInterface {
    id: number;
    image: string;
    userName: string;
    online: string;
    favorites: number;
}



interface FriendListProps {
    list: FriendListInterface[];
    onChatRoom: ( id: number) => void;
}

const FriendsList = (props: FriendListProps) => {
    const { list, onChatRoom } = props;
    const [friends, setFriends] = useState<FriendListInterface[]>(list);

    const [deleteMenu, setDeleteMenu] = useState<{ x: number, y: number, friendId: number | null }>({ x: 0, y: 0, friendId: null });

    const favoriteFriends = friends.filter(friend => friend.favorites === 1);
    const nonFavoriteFriends = friends.filter(friend => friend.favorites === 0);

    const handleContextMenu = (event: React.MouseEvent, friendId: number) => {
        event.preventDefault();
        event.stopPropagation();
        //  특정한 영역에서 클릭한 위치 찾기
        // friendsList위치에서부터 글릭한 곳
        // const top= friendRef.current.getBoundingClientRect().top;
        // const left= friendRef.current.getBoundingClientRect().left;
        // setContextMenu({ x: event.clientX, y: event.clientY, friendId });
        setDeleteMenu({ x: event.screenX, y: event.screenY, friendId });
    };

    const handleCloseDeletetMenu = () => {
        setDeleteMenu({ x: 0, y: 0, friendId: null });
    };

    const handleDeleteFriend = () => {
        console.log('삭제하기')
        if (deleteMenu.friendId !== null) {
            handleCloseDeletetMenu();
        }
    };

    const handleFavoriteToggle = (event: React.MouseEvent, friendId: number) => {
        event.stopPropagation();
        setFriends(friends.map(friend =>
            friend.id === friendId ? { ...friend, favorites: friend.favorites === 1 ? 0 : 1 } : friend
        ));
    };

    console.log('X, Y', deleteMenu.x, deleteMenu.y)

    if (friends.length === 0) {
        return null;
    }

    return (
        <>
            <List>
                <FavoritesWrapper $length={favoriteFriends.length}>
                    {favoriteFriends?.length > 0 &&
                        <FavoritesTitle>
                            즐겨찾기
                        </FavoritesTitle>
                    }
                    {favoriteFriends.map(friend => (
                        <UserContent
                            onContextMenu={(e) => handleContextMenu(e, friend.id)}
                            onClick={() =>
                                onChatRoom(friend.id)}
                            key={friend.id}
                            $disablePointerEvents={deleteMenu.friendId === friend.id}>
                            {deleteMenu.friendId === friend.id && (
                                <DeleteFriend
                                    x={deleteMenu.x}
                                    y={deleteMenu.y}
                                    onClose={handleCloseDeletetMenu}
                                    onDelete={handleDeleteFriend}
                                />
                            )}
                            <Left>
                                <Image
                                    src={friend.image}
                                    width={40.79}
                                    height={40.79}
                                    alt="사용자 프로필" />
                                <UserName>{friend.userName}</UserName>
                                {friend.online === "on" &&
                                    <Online
                                        src="/assets/icons/online.svg"
                                        width={5}
                                        height={5}
                                        alt="온라인" />
                                }
                            </Left>
                            <Image
                                onClick={(e) => handleFavoriteToggle(e, friend.id)}
                                src={
                                    friend.favorites === 1
                                        ? "/assets/icons/favorites.svg"
                                        : "/assets/icons/nonFavorites.svg"
                                }
                                width={15}
                                height={15}
                                alt="즐겨찾기 버튼"
                            />
                        </UserContent>
                    ))}
                </FavoritesWrapper>
                <FriendsWrapper $length={favoriteFriends.length}>
                    <FriendsTitle>
                        친구 {friends.length}
                    </FriendsTitle>
                    {nonFavoriteFriends.map(friend => (
                        <UserContent
                            onContextMenu={(event) => handleContextMenu(event, friend.id)}
                            onClick={() => onChatRoom(friend.id)}
                            key={friend.id}
                            $disablePointerEvents={deleteMenu.friendId === friend.id}
                            >
                            {deleteMenu.friendId === friend.id && (
                                <DeleteFriend
                                    x={deleteMenu.x}
                                    y={deleteMenu.y}
                                    onClose={handleCloseDeletetMenu}
                                    onDelete={handleDeleteFriend}
                                />
                            )}
                            <Left>
                                <Image
                                    src={friend.image}
                                    width={40.79}
                                    height={40.79}
                                    alt="사용자 프로필" />
                                <UserName>{friend.userName}</UserName>
                                {friend.online === "on" &&
                                    <Online
                                        src="/assets/icons/online.svg"
                                        width={5}
                                        height={5}
                                        alt="온라인" />
                                }
                            </Left>
                            <Image
                                onClick={(e) => handleFavoriteToggle(e, friend.id)}
                                src={
                                    friend.favorites === 1
                                        ? "/assets/icons/favorites.svg"
                                        : "/assets/icons/nonFavorites.svg"
                                }
                                width={15}
                                height={15}
                                alt="즐겨찾기 버튼"
                            />
                        </UserContent>
                    ))}
                </FriendsWrapper>
            </List>
        </>
    );
};

export default FriendsList;

const List = styled.div`
`;

const FavoritesWrapper = styled.div<{ $length: number }>`
    padding: ${({ $length }) => ($length > 0 ? '6px 0 11px 0' : 'none')};
`;

const FriendsWrapper = styled.div<{ $length: number }>`
    border-top: ${({ $length }) => ($length > 0 ? `1px solid ${theme.colors.gray400}` : 'none')};
    padding: 6px 0 11px;
`;

const FavoritesTitle = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color: ${theme.colors.gray200}; 
    padding: 0 16px 11px 18px;
`;

const FriendsTitle = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color: ${theme.colors.gray200}; 
    padding: 0 16px 11px 18px;
`;

const UserContent = styled.div<{ $disablePointerEvents: boolean }>`
    position: relative;
    display: flex;  
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 5px 18px 5px 16px;
    ${({ $disablePointerEvents }) => $disablePointerEvents && 'pointer-events: none;'}
    &:hover {
        background: ${theme.colors.gray500}; 
    }
`;

const Left = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: ${theme.colors.gray600};  
`;

const Online = styled(Image)`
    position: absolute;
    top: 19%;
    right: -4%;
`;

