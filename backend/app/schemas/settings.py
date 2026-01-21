from enum import Enum
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

class AccountAction(str, Enum):
    CHANGE_CASH = "CHANGE_CASH"
    RESET_ALL = "RESET_ALL"

class AccountSettingsRequest(BaseModel):
    action: AccountAction
    new_balance: Decimal
    confirm: Optional[bool] = False
    keyword: Optional[str] = None
