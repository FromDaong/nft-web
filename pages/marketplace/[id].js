import { useWallet } from 'use-wallet'
import useGetOpenOrdersForNft from '../../hooks/useGetOpenOrdersForNft'
import React from "react";
import { MarketplaceList } from '../../components/MarketplaceListItem'

const MarketplaceViewWrapper = ({id}) => {
    const orderBook = useGetOpenOrdersForNft(id);
    const { account } = useWallet();

    return (
        <MarketplaceList orderBook={orderBook} displayId={id} account={account} />
    )
}

MarketplaceViewWrapper.getInitialProps = async ({ query: { id } }) => {
  return { id };
};

export default MarketplaceViewWrapper;