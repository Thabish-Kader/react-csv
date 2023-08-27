"use client";
import React, { CSSProperties, useState, useEffect } from "react";
import { useCSVReader } from "react-papaparse";
import { BsCloudUploadFill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
const styles = {
	csvReader: {
		display: "flex",
		flexDirection: "row",
		marginBottom: 10,
	} as CSSProperties,
	browseFile: {
		width: "20%",
	} as CSSProperties,
	acceptedFile: {
		border: "1px solid #ccc",
		height: 45,
		lineHeight: 2.5,
		paddingLeft: 10,
		width: "80%",
	} as CSSProperties,
	remove: {
		borderRadius: 0,
		padding: "0 20px",
	} as CSSProperties,
	progressBarBackgroundColor: {
		backgroundColor: "green",
	} as CSSProperties,
};

export default function CSVReader() {
	const { CSVReader } = useCSVReader();
	const [csvData, setCsvData] = useState<any>();

	function transformCSVtoJSON(csvData: any[][]): any[] | null {
		if (!csvData || csvData.length === 0) {
			return null; // Return null or handle empty data case
		}

		const [headers, ...rows] = csvData; // Destructure the first row as headers and rest as rows

		const jsonData = rows.map((row) => {
			const obj: { [key: string]: any } = {};
			headers.forEach((header, index) => {
				obj[header] = row[index];
			});
			return obj;
		});

		return jsonData;
	}

	const jsonFormattedData = transformCSVtoJSON(csvData);
	console.log(jsonFormattedData);

	return (
		<div className="max-w-5xl mx-auto px-24 pt-20">
			<div className="flex items-center tracking-widest cursor-pointer">
				<p className="text-blue-500">This is CSV Upload Vid.</p>
			</div>
			<h1 className="mt-4 text-4xl font-bold">Upload CSV</h1>
			<CSVReader
				onUploadAccepted={({ data }: { data: any }) => {
					setCsvData(data);
				}}
			>
				{({
					getRootProps,
					acceptedFile,
					ProgressBar,
					getRemoveFileProps,
				}: any) => (
					<>
						<div className="mt-4 relative" style={styles.csvReader}>
							<button
								type="button"
								{...getRootProps()}
								className="relative h-[300px] flex flex-col justify-center items-center w-full border border-dashed border-gray-800 rounded-md"
							>
								{acceptedFile ? (
									<p className="font-bold text-xl">
										{acceptedFile.name}
									</p>
								) : (
									<BsCloudUploadFill className="h-52 w-52 text-green-500" />
								)}
							</button>
							<button
								{...getRemoveFileProps()}
								className="absolute top-2 right-2"
							>
								<GiCancel className="text-red-500" siz={30} />
							</button>
							<ProgressBar
								className="absolute bottom-4"
								style={styles.progressBarBackgroundColor}
							/>
						</div>
					</>
				)}
			</CSVReader>

			{csvData?.length > 0 && (
				<div className="max-w-7xl mx-auto px-24 pt-20">
					<table className="w-full">
						<tr className="">
							<th>Column Name</th>
							<th>Select Type</th>
							<th>Samples</th>
						</tr>
					</table>
					<tbody className="w-full">
						{csvData[0]?.map(
							(columnName: string, columnIndex: number) => (
								<tr
									key={columnIndex}
									className="flex justify-between border-b py-4"
								>
									<td className="w-56">{columnName}</td>
									<td className="mx-10 w-56">
										<select className="flex-1 bg-transparent border rounded-md px-4 py-1">
											{csvData[0].map(
												(
													optionName: string,
													optionIndex: number
												) => (
													<option
														key={optionIndex}
														value={optionName}
														selected={
															optionName ===
															columnName
														}
													>
														{optionName}
													</option>
												)
											)}
										</select>
									</td>
									<td className="w-56 flex flex-col font-bold">
										{csvData
											.slice(1, 5)
											.map(
												(
													entry: string,
													entryIndex: number
												) => (
													<p key={entryIndex}>
														{entry[columnIndex]}
													</p>
												)
											)}
									</td>
								</tr>
							)
						)}
					</tbody>
				</div>
			)}
		</div>
	);
}
