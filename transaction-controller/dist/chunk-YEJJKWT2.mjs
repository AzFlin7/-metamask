// src/types.ts
var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
  TransactionStatus2["approved"] = "approved";
  TransactionStatus2["cancelled"] = "cancelled";
  TransactionStatus2["confirmed"] = "confirmed";
  TransactionStatus2["dropped"] = "dropped";
  TransactionStatus2["failed"] = "failed";
  TransactionStatus2["rejected"] = "rejected";
  TransactionStatus2["signed"] = "signed";
  TransactionStatus2["submitted"] = "submitted";
  TransactionStatus2["unapproved"] = "unapproved";
  return TransactionStatus2;
})(TransactionStatus || {});
var WalletDevice = /* @__PURE__ */ ((WalletDevice2) => {
  WalletDevice2["MM_MOBILE"] = "metamask_mobile";
  WalletDevice2["MM_EXTENSION"] = "metamask_extension";
  WalletDevice2["OTHER"] = "other_device";
  return WalletDevice2;
})(WalletDevice || {});
var TransactionType = /* @__PURE__ */ ((TransactionType2) => {
  TransactionType2["cancel"] = "cancel";
  TransactionType2["contractInteraction"] = "contractInteraction";
  TransactionType2["deployContract"] = "contractDeployment";
  TransactionType2["ethDecrypt"] = "eth_decrypt";
  TransactionType2["ethGetEncryptionPublicKey"] = "eth_getEncryptionPublicKey";
  TransactionType2["incoming"] = "incoming";
  TransactionType2["personalSign"] = "personal_sign";
  TransactionType2["retry"] = "retry";
  TransactionType2["simpleSend"] = "simpleSend";
  TransactionType2["sign"] = "eth_sign";
  TransactionType2["signTypedData"] = "eth_signTypedData";
  TransactionType2["smart"] = "smart";
  TransactionType2["swap"] = "swap";
  TransactionType2["swapApproval"] = "swapApproval";
  TransactionType2["tokenMethodApprove"] = "approve";
  TransactionType2["tokenMethodSafeTransferFrom"] = "safetransferfrom";
  TransactionType2["tokenMethodTransfer"] = "transfer";
  TransactionType2["tokenMethodTransferFrom"] = "transferfrom";
  TransactionType2["tokenMethodSetApprovalForAll"] = "setapprovalforall";
  TransactionType2["tokenMethodIncreaseAllowance"] = "increaseAllowance";
  return TransactionType2;
})(TransactionType || {});
var TransactionEnvelopeType = /* @__PURE__ */ ((TransactionEnvelopeType2) => {
  TransactionEnvelopeType2["legacy"] = "0x0";
  TransactionEnvelopeType2["accessList"] = "0x1";
  TransactionEnvelopeType2["feeMarket"] = "0x2";
  return TransactionEnvelopeType2;
})(TransactionEnvelopeType || {});
var UserFeeLevel = /* @__PURE__ */ ((UserFeeLevel2) => {
  UserFeeLevel2["CUSTOM"] = "custom";
  UserFeeLevel2["DAPP_SUGGESTED"] = "dappSuggested";
  UserFeeLevel2["MEDIUM"] = "medium";
  return UserFeeLevel2;
})(UserFeeLevel || {});
var GasFeeEstimateLevel = /* @__PURE__ */ ((GasFeeEstimateLevel2) => {
  GasFeeEstimateLevel2["low"] = "low";
  GasFeeEstimateLevel2["medium"] = "medium";
  GasFeeEstimateLevel2["high"] = "high";
  return GasFeeEstimateLevel2;
})(GasFeeEstimateLevel || {});
var SimulationTokenStandard = /* @__PURE__ */ ((SimulationTokenStandard2) => {
  SimulationTokenStandard2["erc20"] = "erc20";
  SimulationTokenStandard2["erc721"] = "erc721";
  SimulationTokenStandard2["erc1155"] = "erc1155";
  return SimulationTokenStandard2;
})(SimulationTokenStandard || {});
var SimulationErrorCode = /* @__PURE__ */ ((SimulationErrorCode2) => {
  SimulationErrorCode2["ChainNotSupported"] = "chain-not-supported";
  SimulationErrorCode2["Disabled"] = "disabled";
  SimulationErrorCode2["InvalidResponse"] = "invalid-response";
  SimulationErrorCode2["Reverted"] = "reverted";
  return SimulationErrorCode2;
})(SimulationErrorCode || {});

export {
  TransactionStatus,
  WalletDevice,
  TransactionType,
  TransactionEnvelopeType,
  UserFeeLevel,
  GasFeeEstimateLevel,
  SimulationTokenStandard,
  SimulationErrorCode
};
//# sourceMappingURL=chunk-YEJJKWT2.mjs.map