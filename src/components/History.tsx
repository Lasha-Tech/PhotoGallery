import styled, {css} from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";


const History: React.FC = () => {
    return (
        <MainDiv>
            <Header>
                <SearchedWords>
                    ბოლოს მოძებნილი: 
                </SearchedWords>

                <PageLink>
                    მთავარი
                </PageLink>
            </Header>

            <ImgContainer>
                
            </ImgContainer>
        </MainDiv>
    );
}
 
export default History;

const MainDiv = styled.div`
    width: 70%;
`

const ImgContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    align-items: flex-start;
    justify-content: space-between;
`

const Img = styled.img`
    height: 300px;
    width: 230px;
    border-radius: 8px;
    overflow: hidden;
` 

const Spinner = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid #323334;
    border-right: 3px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin: 0 auto;

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
`

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 80px;
`

const PageLink = styled.div`
    padding: 10px 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #fff;
    background-color: #323334;
    border: 2px solid transparent;
    cursor: pointer;
    font-weight: 600;
    transition: all .3s ease;

    &:hover {
        color: #323334;
        background-color: #fff;
        border: 2px solid #323334;
    }
`

const SearchedWords = styled.p`
    font-size: 20px;
    font-weight: 700;
    color: #323334;
    width: 70%;
    display: inline-flex;
    align-items: flex-start;
    flex-wrap: wrap;
    row-gap: 5px;
    column-gap: 8px;
`

const Chips = styled.div`
    font-size: 16px;
    font-weight: 500;
    width: fit-content;
    padding: 3px;
    color: #fff;
    fill: #fff;
    background-color: #1079e1;
    border: 2px solid transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    cursor: pointer;
    transition: all .2s ease;

    &:hover {
        background-color: #fff;
        border: 2px solid #1079e1;
        color: #1079e1;
        fill: #1079e1;

    }
 
    .x:hover {
        padding: 2px;
        background-color: #1079e1;
        border-radius: 50%;
        fill: #fff;
        transform: scale(1.4);
        transition: transform .1s ease;

    }   
`