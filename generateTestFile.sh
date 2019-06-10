# This is a program to generate a large test file.
MAX=1000
output='/tmp/generateTestFile.txt'

rm -fr ${output}; touch ${output}

for (( i=1; i<=${MAX}; i++ )); do
	now=$(date +%s)
	randomName=$(echo "${i}${now}" | sha256sum | base64 | head -c 8) 
	echo "Driver ${randomName}" >> ${output}
	echo "Trip ${randomName} 01:23 04:56 1" >> ${output}
	echo "Trip ${randomName} 02:34 05:01 50.1" >> ${output}
	echo "Trip ${randomName} 04:56 07:12 110.25" >> ${output}
	echo "Trip ${randomName} 08:25 09:00 200" >> ${output}
	echo "Driver ${randomName} No Miles" >> ${output}
done
