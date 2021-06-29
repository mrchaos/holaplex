import sv from '../../constants/Styles'
import styled from 'styled-components';
import Button from '../../components/core/Button';
import TextInput from '../../components/core/TextInput';
import {
  Text,
  H2,
  RoundedContainer,
  Actions
} from '../../constants/StyleComponents'
// @ts-ignore
import debounce from 'debounce'
import { checkStorefrontAvailability } from '../../lib/services/context/actions'
import { useStorefrontContext } from '../../lib/services/context';
import { BaseSyntheticEvent } from 'react';

const NameField = styled(TextInput)`
  margin: ${sv.appPadding}px 0;
`;

const debouncedCheck = debounce(checkStorefrontAvailability, 300)

type Props = {
  nextAction: () => void,
  backAction: () => void,
}

const StepOne = ({nextAction, backAction}: Props) => {
  const {
    dispatch,
    available,
    desiredStorefrontSubdomain
  } = useStorefrontContext();
  
  const debouncedCheck = debounce((subdomain: string) => checkStorefrontAvailability(subdomain, dispatch), 300)
  console.log({ available }, 'updated availability')
  
  return (
    // @ts-ignore
    <RoundedContainer small>
      <H2>Now for your sub-domain.</H2>
      <Text>This is the address that people will use to get to your store.</Text>
      <NameField 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedCheck(e.target.value)}
        subDomain=".holaplex.com"
      />
      { desiredStorefrontSubdomain.length && 
        <Text
        color={available ? '#27AE60': 'red'}
        style={{ textAlign: 'right' }}> {available ? 'domain available' : 'domain already taken :-('}</Text>
      }
      <Actions>
        <Button
          label="Back"
          subtle
          marginRight
          action={backAction}
        />
        <Button
          subtle={!available}
          label="Next"
          action={nextAction}
        />
      </Actions>
    </RoundedContainer>
  )
}

export default StepOne;