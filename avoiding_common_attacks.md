## Avoiding Common Attacks

### Pull Over Push
All contract calls are received and the contract does not call any external contracts.

### Use Modifiers Only for Validation 
Only one modifier is used (hasLicence), and it is used for validation.

### Timestamp Dependence
Timestamps are not used in the code

### SWC-107 - Re-entrancy
In the purchaseLicence function, the licence is granted AFTER the payment has completed.

### SWC-115 - Authorization through tx.origin
msg.sender is used to authenticate the caller in all cases