import { StyledButton, StyledButtonsRow } from './styles';

export interface ActionButtonsProps {
  onFetch: () => void;
  onRetry: () => void;
  retryDisabled: boolean;
}

export function ActionButtons(props: ActionButtonsProps): JSX.Element {
  return (
    <StyledButtonsRow>
      <StyledButton className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" onClick={props.onFetch}>Request Unlock</StyledButton>
      <StyledButton className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" onClick={props.onRetry} disabled={props.retryDisabled}>
        Retry with paymentId
      </StyledButton>
    </StyledButtonsRow>
  );
}
