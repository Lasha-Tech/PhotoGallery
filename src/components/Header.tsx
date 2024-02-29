import styled, { css } from "styled-components";
import { useState } from "react";

interface InputDivProps {
    focused: Boolean;
}

const Header = () => {
    const [activePage, setActivePage] = useState<String>('Main')
    const [focused, setFocused] = useState<Boolean>(false);

    return (
        <HeaderDiv>
            <InputDiv focused={focused}>
                <SearchInput onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}/>
                <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg> 
            </InputDiv>

            <TabDiv>
                <PageLink style={{transform: activePage === 'Main'? 'scale(1.15)': 'none'}} onClick={() => setActivePage('Main')}>
                    Main
                </PageLink>

                <PageLink style={{transform: activePage === 'History'? 'scale(1.15)': 'none'}} onClick={() => setActivePage('History')}>
                    History
                </PageLink>
            </TabDiv>
        </HeaderDiv>
    );
}
 
export default Header;

const HeaderDiv = styled.div`
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 50px 0px;
`

const InputDiv = styled.div<InputDivProps>(
    ({focused}) => css`
        width: 400px;
        max-width: 60%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background-color: #323334;
        color: #fff;
        fill: ${focused? '#4b6781': '#fff'};
        font-size: 18px;
        padding-right: 10px;
        border-radius: 4px;
        transition: all .5s ease-in-out;
        border: 3px solid ${focused? '#4b6781': 'transparent'};

        &:hover {
            transition: all .5s ease-in-out;
            background-color: ${focused? '#323334': '#4b6781'};
        }
    `
)

const SearchInput = styled.input`
    width: 100%;
    height: 100%;
    padding: 10px 0px 10px 10px;
    outline: none;
    border: none;
    font-size: inherit;
    border-radius: inherit;
    background-color: inherit;
    color: inherit;
    font-family: inherit;
`

const TabDiv = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
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