import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function Logs({ logs }: { logs: { data: string, time: string }[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Message</TableHead>
					<TableHead>Time</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{logs.toReversed().map((content, key) =>
					<TableRow key={key}>
						<TableCell>{content.data}</TableCell>
						<TableCell>{content.time}</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}
