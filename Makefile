.PHONY: front back

front:
	cd frontend && npm run dev

back:
	cd backend && symfony serve