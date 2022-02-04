/* eslint-disable react/display-name */
import styled from 'styled-components';
import Image from 'next/image';
import { Settings } from '../icons/Settings';
import { WalletLabel, WalletPill } from './WalletIndicator';
import { MiniWallet } from './MiniWallet';
import { forwardRef, useEffect } from 'react';
import { useWalletProfileLazyQuery } from 'src/graphql/indexerTypes';
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolBalance } from '../SolBalance';
import { DisconnectWalletButton } from './Button';

export const ProfilePopover = forwardRef<HTMLDivElement>((_, ref) => {
  const [queryWalletProfile, walletProfile] = useWalletProfileLazyQuery();
  const { connected, publicKey } = useWallet();
  const { data: twitterHandle } = useTwitterHandle(publicKey);

  useEffect(() => {
    if (!twitterHandle) return;
    queryWalletProfile({
      variables: {
        handle: twitterHandle,
      },
    });
  }, [queryWalletProfile, twitterHandle]);

  const profilePictureUrl = connected ? walletProfile.data?.profile?.profileImageUrlHighres : null;
  const textOverride = connected ? twitterHandle : null;

  return (
    <PopoverBox ref={ref}>
      <FirstRow>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <ProfilePicture
            width={PFP_SIZE}
            height={PFP_SIZE}
            src={profilePictureUrl ?? '/images/gradients/gradient-3.png'}
            alt="Profile Picture"
          />
          <div
            style={{
              marginLeft: 20,
            }}
          >
            <WalletPill disableBackground textOverride={textOverride} publicKey={publicKey} />
          </div>
        </div>
      </FirstRow>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 24,
        }}
      >
        <SolBalance />
        <WalletLabel />
      </div>
      <DisconnectWalletButton />
    </PopoverBox>
  );
});

const PFP_SIZE = 80;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const PopoverBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px; // Since ANTD Popover Inner Content ist like 12x16px
`;

const ProfilePicture = styled(Image)`
  border-radius: 50%;
`;
