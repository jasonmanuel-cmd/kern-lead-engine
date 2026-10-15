from abc import ABC, abstractmethod
from collections.abc import Iterable
from ..models import Record

class Adapter(ABC):
    @abstractmethod
    def fetch(self) -> Iterable[Record]: ...
